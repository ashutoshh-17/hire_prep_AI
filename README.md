# HirePrepAI

AI-powered resume analyzer that extracts skills from your resume, parses job descriptions dynamically, and tells you exactly what you're missing — with a match score, skill gaps, and actionable suggestions.

---

## What it does

- **Analyzes your resume** against any job description you paste
- **Extracts skills automatically** using a custom-trained RoBERTa NER model (F1 = 98.14%, trained on 26,000 real resumes) + a 500+ skill ontology + regex patterns
- **Scores your match** as a percentage of required JD skills found in your resume
- **Identifies skill gaps** ranked by priority (high / medium) with soft vs technical categorization
- **Generates suggestions** tailored to your score and missing skills
- **Saves history** locally — revisit any past analysis
- **Download report** as a printable PDF

---

## Tech Stack

**Frontend** — React + TypeScript + Vite + Tailwind CSS  
**Backend** — Python + FastAPI + spaCy (RoBERTa Transformer NER) + Sentence Transformers

---

## Project Structure

```
hire_prep_AI/
├── backend/
│   ├── main.py              # FastAPI server — all API logic
│   ├── skill_ontology.py    # 500+ skill database + JD scanner
│   └── requirements.txt     # Python dependencies
├── src/
│   ├── components/
│   │   ├── analyze/         # Upload zone, JD input
│   │   ├── results/         # Score card, skill gaps, matched skills, suggestions
│   │   └── layout/          # Header, Footer, Theme
│   ├── pages/               # Analyze, Results, History, Auth
│   └── types/               # TypeScript interfaces
└── ...
```

---

## Running the Project

### Prerequisites

- Python 3.10+
- Node.js 18+
- The trained NER model at `backend/ml/output/model-best/`

---

### 1. Backend

```bash
cd backend

# Create virtual environment (first time only)
python -m venv .venv

# Activate it
.venv\Scripts\activate          # Windows
source .venv/bin/activate       # macOS / Linux

# Install dependencies (first time only)
pip install -r requirements.txt

# Start the server
python main.py
```

Server runs at **http://localhost:8000**

> To verify: open http://localhost:8000/health in your browser.

---

### 2. Frontend

```bash
# From the project root
npm install      # first time only
npm run dev
```

App runs at **http://localhost:5173**

---

## How to Use

1. Open the app and go to **Analyze Resume**
2. Upload your resume as a **PDF**
3. Paste the full **job description** you're targeting
4. Click **Analyze Resume** and wait ~5–10 seconds
5. View your match score, detected skills, gaps, and suggestions
6. Revisit past analyses from the **History** page
7. Click **Download Report** to save a formatted copy

---

## How the AI Pipeline Works

```
Resume PDF  ──► NER Model (RoBERTa)  ──┐
                                        ├──► Semantic Matching ──► Score + Gaps
Job Description ──► Ontology Scan   ──┤    (all-MiniLM-L6-v2)
                ──► Regex Patterns  ──┘
```

**Resume extraction** — NER model (high precision on resume text) + ontology fallback  
**JD extraction** — 3 layers: ontology scan → NER model → regex phrase patterns  
**Matching** — exact string match → canonical alias match → cosine similarity (threshold 0.55–0.72)

---

## Retraining the NER Model

Training datasets are cached locally at:
```
~/.cache/huggingface/datasets/
```

To retrain, uncomment the training dependencies in `requirements.txt` and reinstall:
```
pandas
datasets
scikit-learn
```

The base `roberta-base` model weights are also cached at `~/.cache/huggingface/hub/models--roberta-base/`.

---

## Notes

- The backend **forces CPU mode** (`spacy.require_cpu()`). GPU support requires PyTorch with CUDA — see comments in `requirements.txt`
- Analysis history is stored in **localStorage** (browser only, no database needed)
- The trained NER model (`ml/output/model-best/`) is excluded from git — store it separately or retrain
