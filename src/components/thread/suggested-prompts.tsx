import { motion } from "framer-motion";
import {
  UserSearch,
  Crosshair,
  Network,
  ArrowLeftRight,
  Link2,
  Target,
  Lightbulb,
} from "lucide-react";

interface SuggestedPrompt {
  id: string;
  rank: number;
  /** Short pattern name, e.g. "The Direct Classic". */
  name: string;
  /** When to reach for this pattern. */
  use: string;
  /** Concrete, ready-to-send example inserted on click. */
  example: string;
  icon: React.ComponentType<{ className?: string }>;
}

const suggestedPrompts: SuggestedPrompt[] = [
  {
    id: "direct-classic",
    rank: 1,
    name: "The Direct Classic",
    use: "When you already know exactly who you want to reach.",
    example:
      "Find João Silva's contact at Brookfield. I need his email, phone, and LinkedIn.",
    icon: UserSearch,
  },
  {
    id: "decision-maker-hunter",
    rank: 2,
    name: "The Decision-Maker Hunter",
    use: "When you know the company but not the right person.",
    example:
      "Who is the Head of Real Estate Investments at Itaúsa? Give me the full profile and contact",
    icon: Crosshair,
  },
  {
    id: "c-level-mapper",
    rank: 3,
    name: "The C-Level Mapper",
    use: "For a multi-stakeholder or account-based approach.",
    example:
      "Map Cyrela's C-Level: CEO, CFO, head of development, and commercial director. I want profiles and contacts",
    icon: Network,
  },
  {
    id: "job-change-checker",
    rank: 4,
    name: "The Job-Change Checker",
    use: "Reactivate relationships and refresh your database.",
    example:
      "Is Ricardo Almendra still at RBR Asset? If not, where is he now and what's the contact?",
    icon: ArrowLeftRight,
  },
  {
    id: "linkedin-decoder",
    rank: 5,
    name: "The LinkedIn Decoder",
    use: "Found someone on LinkedIn but missing their details.",
    example:
      "Look up this LinkedIn profile: linkedin.com/in/example-profile. I want their email, phone, and a sense of their professional background.",
    icon: Link2,
  },
  {
    id: "full-strategist",
    rank: 6,
    name: "The Full Strategist",
    use: "For a consultative, personalized approach.",
    example:
      "I'm approaching Vinci Partners for GRI membership. Who's the decision-maker for this kind of partnership, what's their profile, and how do I reach them?",
    icon: Target,
  },
];

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  onHoverPrompt?: (prompt: string | null) => void;
}

export function SuggestedPrompts({
  onSelectPrompt,
  onHoverPrompt,
}: SuggestedPromptsProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-2">
      <div className="mb-3 flex items-center gap-3">
        <span className="text-muted-foreground/80 font-mono text-[11px] tracking-[0.18em] uppercase">
          Enrichment patterns
        </span>
        <div className="from-border h-px flex-1 bg-gradient-to-r to-transparent" />
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {suggestedPrompts.map((prompt, index) => {
          const Icon = prompt.icon;
          return (
            <motion.button
              key={prompt.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + index * 0.06, duration: 0.35 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPrompt(prompt.example)}
              onMouseEnter={() => onHoverPrompt?.(prompt.example)}
              onMouseLeave={() => onHoverPrompt?.(null)}
              className="group border-border bg-card/60 hover:border-primary/40 hover:bg-card hover:shadow-primary/30 relative flex flex-col gap-2 overflow-hidden rounded-xl border p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-12px]"
            >
              {/* Amber wash that blooms on hover */}
              <span className="from-primary/10 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex items-center justify-between">
                <span className="border-border bg-background/60 text-muted-foreground group-hover:border-primary/50 group-hover:text-primary flex size-8 items-center justify-center rounded-lg border transition-colors duration-200">
                  <Icon className="size-4" />
                </span>
                <span className="text-muted-foreground/50 group-hover:text-primary/70 font-mono text-xs tabular-nums transition-colors">
                  {String(prompt.rank).padStart(2, "0")}
                </span>
              </div>

              <div className="relative">
                <p className="font-display text-foreground text-sm font-semibold tracking-tight">
                  {prompt.name}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs leading-snug">
                  {prompt.use}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="border-border/60 bg-muted/40 text-muted-foreground mt-3.5 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs">
        <Lightbulb className="text-primary/80 mt-0.5 size-3.5 shrink-0" />
        <p className="leading-relaxed">
          For the best results, give me a{" "}
          <span className="text-foreground/90 font-medium">
            full name and company
          </span>
          . Got a{" "}
          <span className="text-foreground/90 font-medium">LinkedIn URL</span>?
          That&apos;s all I need. After enrichment, I can verify or create the
          contact in{" "}
          <span className="text-foreground/90 font-medium">Salesforce</span>.
        </p>
      </div>
    </div>
  );
}
