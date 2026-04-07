import os
import sys
import re
os.environ["PYTHONIOENCODING"] = "utf-8"
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import spacy
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer, util
import io
import uuid
from datetime import datetime
from typing import List
from pydantic import BaseModel

from skill_ontology import scan_text_for_skills, CANONICAL_DISPLAY, SOFT_SKILLS

app = FastAPI(title="HirePrepAi Backend", version="3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

spacy.require_cpu()

print("Loading NER model...", flush=True)
try:
    nlp = spacy.load("ml/output/model-best")
    print("NER model loaded (RoBERTa, F1=98.14%).", flush=True)
except Exception as e:
    print(f"NER model load failed: {e}", flush=True)
    nlp = spacy.blank("en")

print("Loading semantic similarity model...", flush=True)
matcher = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')
print("All models ready.", flush=True)


class SkillGap(BaseModel):
    skill: str
    category: str
    priority: str
    description: str

class MatchedSkill(BaseModel):
    skill: str
    category: str
    matchStrength: str

class Suggestion(BaseModel):
    id: str
    title: str
    description: str
    priority: str
    category: str

class AnalysisResult(BaseModel):
    id: str
    jobTitle: str
    fileName: str
    overallScore: int
    analyzedAt: str
    skillGaps: List[SkillGap]
    matchedSkills: List[MatchedSkill]
    suggestions: List[Suggestion]
    summary: str
    extractedResumeSkills: List[str]


def extract_text_from_pdf(file_content: bytes) -> str:
    pdf = PdfReader(io.BytesIO(file_content))
    return "\n".join(p for page in pdf.pages if (p := page.extract_text()))


def extract_skills_with_ner(text: str) -> List[str]:
    all_skills = set()
    raw_lines = [line.strip() for line in text.split('\n') if len(line.strip()) > 2]
    blocks, current = [], ""
    for line in raw_lines:
        if len(current) + len(line) < 1000:
            current += " " + line
        else:
            blocks.append(current.strip())
            current = line
    if current:
        blocks.append(current.strip())
    for block in blocks:
        for ent in nlp(block).ents:
            if ent.label_ == "SKILL" and len(ent.text.strip()) > 1:
                cleaned = ent.text.strip().title() if len(ent.text) < 15 else ent.text.strip()
                all_skills.add(cleaned)
    return sorted(all_skills)


_JD_PATTERNS = [
    r'experience (?:with|in|using|of)\s+([\w\.\+\#\/\s]{2,40}?)(?:\s*[,\.\n;(]|$)',
    r'proficien(?:t|cy) (?:in|with)\s+([\w\.\+\#\/\s]{2,40}?)(?:\s*[,\.\n;(]|$)',
    r'knowledge (?:of|in)\s+([\w\.\+\#\/\s]{2,40}?)(?:\s*[,\.\n;(]|$)',
    r'familiar(?:ity)? with\s+([\w\.\+\#\/\s]{2,40}?)(?:\s*[,\.\n;(]|$)',
    r'skilled (?:in|with)\s+([\w\.\+\#\/\s]{2,40}?)(?:\s*[,\.\n;(]|$)',
    r'working knowledge of\s+([\w\.\+\#\/\s]{2,40}?)(?:\s*[,\.\n;(]|$)',
    r'([\w\.\+\#\/\s]{2,30}?)\s+(?:is\s+)?(?:required|preferred|a plus|an advantage|a must)',
    r'hands[\-\s]on (?:experience )?(?:with|in)\s+([\w\.\+\#\/\s]{2,40}?)(?:\s*[,\.\n;(]|$)',
    r'\d+\+?\s+years?\s+(?:of\s+)?(?:experience\s+(?:with|in|using)?\s+)?([\w\.\+\#\/\s]{2,40}?)(?:\s*[,\.\n;(]|$)',
    r'(?:using|leveraging|working with)\s+([\w\.\+\#\/\s]{2,30}?)(?:\s*[,\.\n;(]|$)',
    r'[-•]\s*([\w\.\+\#\/][\w\.\+\#\/\s,]{2,80}?)(?:\n|$)',
]

def _regex_extract_from_jd(jd_text: str) -> List[str]:
    candidates = set()
    for pattern in _JD_PATTERNS:
        for match in re.finditer(pattern, jd_text, re.IGNORECASE):
            for item in re.split(r'[,/]', match.group(1)):
                item = item.strip().rstrip('.,;:')
                if 2 < len(item) < 50 and not item.lower().startswith(('and ', 'or ', 'the ', 'a ', 'an ')):
                    candidates.add(item)
    return list(candidates)


def extract_skills_from_jd(jd_text: str) -> List[str]:
    found: dict[str, str] = {}

    for skill in scan_text_for_skills(jd_text):
        found[skill.lower()] = skill

    try:
        for skill in extract_skills_with_ner(jd_text):
            if skill.lower() not in found:
                found[skill.lower()] = skill
    except Exception:
        pass

    for candidate in _regex_extract_from_jd(jd_text):
        for skill in scan_text_for_skills(candidate):
            if skill.lower() not in found:
                found[skill.lower()] = skill

    return sorted(found.values())


def extract_skills_from_resume(resume_text: str) -> List[str]:
    found: dict[str, str] = {}
    for skill in extract_skills_with_ner(resume_text):
        found[skill.lower()] = skill
    for skill in scan_text_for_skills(resume_text):
        if skill.lower() not in found:
            found[skill.lower()] = skill
    return sorted(found.values())


def _skill_category(skill: str) -> str:
    return "soft" if skill.lower() in SOFT_SKILLS else "technical"


def analyze_skills(extracted: List[str], required: List[str], resume_text: str):
    matched, gaps = [], []
    req_vecs = matcher.encode(required, convert_to_tensor=True, device='cpu') if required else []
    ext_vecs = matcher.encode(extracted, convert_to_tensor=True, device='cpu') if extracted else []

    for i, req_skill in enumerate(required):
        category = _skill_category(req_skill)

        if req_skill.lower() in resume_text.lower():
            matched.append({"skill": req_skill, "category": category, "matchStrength": "strong"})
            continue

        canonical = CANONICAL_DISPLAY.get(req_skill.lower(), req_skill)
        if canonical.lower() in resume_text.lower():
            matched.append({"skill": req_skill, "category": category, "matchStrength": "strong"})
            continue

        best_score = 0.0
        if extracted and len(req_vecs) > 0 and len(ext_vecs) > 0:
            best_score = float(util.cos_sim(req_vecs[i], ext_vecs)[0].max())

        if best_score >= 0.72:
            matched.append({
                "skill": req_skill,
                "category": category,
                "matchStrength": "strong" if best_score >= 0.85 else "partial"
            })
        elif best_score >= 0.55:
            matched.append({"skill": req_skill, "category": category, "matchStrength": "partial"})
        else:
            gaps.append({
                "skill": req_skill,
                "category": category,
                "priority": "high" if best_score < 0.35 else "medium",
                "description": f"'{req_skill}' is not clearly mentioned in your resume. Add projects or experience that demonstrate it."
            })

    return matched, gaps


def generate_suggestions(gaps: List[dict], score: int) -> List[dict]:
    suggestions = []
    top_gaps = [g for g in gaps if g["priority"] == "high"][:3] + \
               [g for g in gaps if g["priority"] == "medium"][:2]

    for i, gap in enumerate(top_gaps):
        suggestions.append({
            "id": str(i + 1),
            "title": f"Add '{gap['skill']}' to your resume",
            "description": f"'{gap['skill']}' appears to be a key requirement. Add a project, certification, or experience that demonstrates it.",
            "priority": gap["priority"],
            "category": "skills"
        })

    idx = len(suggestions)
    if score < 40:
        suggestions.append({
            "id": str(idx + 1),
            "title": "Tailor your resume to this role",
            "description": "Your resume has a low match score. Restructure your experience section to highlight technologies that align with this specific job description.",
            "priority": "high",
            "category": "content"
        })
    elif score < 70:
        suggestions.append({
            "id": str(idx + 1),
            "title": "Quantify your achievements",
            "description": "Add measurable outcomes (e.g., 'improved API response time by 40%', 'led a team of 5 engineers').",
            "priority": "medium",
            "category": "content"
        })
    else:
        suggestions.append({
            "id": str(idx + 1),
            "title": "Optimize for ATS systems",
            "description": "Your resume is a strong match. Ensure keywords appear in their exact form so Applicant Tracking Systems rank you higher.",
            "priority": "low",
            "category": "format"
        })

    return suggestions


@app.post("/analyze", response_model=AnalysisResult)
async def analyze_resume(file: UploadFile = File(...), job_description: str = Form(...)):
    print(f"\n[ANALYZE] {file.filename}", flush=True)
    try:
        content = await file.read()
        resume_text = extract_text_from_pdf(content)
        if not resume_text.strip():
            raise ValueError("Could not extract text. PDF may be image-based or empty.")

        extracted_skills = extract_skills_from_resume(resume_text)
        print(f"[RESUME] {len(extracted_skills)} skills extracted", flush=True)

        required_skills = extract_skills_from_jd(job_description)
        if not required_skills:
            required_skills = list({w for w in re.findall(r'\b[A-Z][a-zA-Z\.\+\#]{1,20}\b', job_description) if len(w) > 2})[:15]
        print(f"[JD] {len(required_skills)} required skills extracted", flush=True)

        matched_skills, skill_gaps = analyze_skills(extracted_skills, required_skills, resume_text)
        print(f"[MATCH] {len(matched_skills)} matched, {len(skill_gaps)} gaps", flush=True)

        score = int((len(matched_skills) / len(required_skills)) * 100) if required_skills else 0
        suggestions = generate_suggestions(skill_gaps, score)

        summary = (
            f"Your resume is a {score}% match for the provided job description. "
            f"Our AI found {len(extracted_skills)} skills in your resume, "
            f"matched {len(matched_skills)} of {len(required_skills)} required skills, "
            f"and identified {len(skill_gaps)} gaps."
        )

        return {
            "id": str(uuid.uuid4()),
            "jobTitle": "Custom Job Description",
            "fileName": file.filename,
            "overallScore": score,
            "analyzedAt": datetime.utcnow().isoformat() + "Z",
            "skillGaps": skill_gaps,
            "matchedSkills": matched_skills,
            "suggestions": suggestions,
            "summary": summary,
            "extractedResumeSkills": extracted_skills,
        }

    except Exception as e:
        import traceback
        print(f"[ERROR] {e}\n{traceback.format_exc()}", flush=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health():
    return {"status": "ok", "pipeline": "Hybrid 3-Layer: Ontology + NER + Regex"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
