import { Link } from "react-router-dom";
import { FileText, Github, Linkedin, Twitter } from "lucide-react";

const SOCIAL_LINKS = [
  { icon: Twitter, href: "#" },
  { icon: Linkedin, href: "#" },
  { icon: Github, href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50 theme-transition">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">HirePrepAI</span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              AI-powered resume analysis that helps you identify skill gaps and land your dream job.
              Upload your resume and get instant, actionable feedback.
            </p>
            <div className="flex gap-4 mt-6">
              {SOCIAL_LINKS.map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: "Home", to: "/" },
                { label: "Analyze Resume", to: "/analyze" },
                { label: "Analysis History", to: "/history" },
                { label: "Sign In", to: "/auth" },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-muted-foreground hover:text-foreground transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {["How It Works", "Resume Tips", "FAQ", "Contact Us"].map((label) => (
                <li key={label}>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HirePrepAI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
