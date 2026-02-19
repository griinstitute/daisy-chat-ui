import { motion } from "framer-motion";
import {
  MessageSquare,
  Mail,
  Search,
  FileText,
  Sparkles,
  Building2,
  TrendingUp,
  Newspaper,
  Users,
  RefreshCw,
  UserPlus,
} from "lucide-react";

interface SuggestedPrompt {
  id: string;
  label: string;
  prompt: string;
  icon: React.ComponentType<{ className?: string }>;
}

const suggestedPrompts: SuggestedPrompt[] = [
  {
    id: "know-daisy",
    label: "Know about dAIsy",
    prompt: "Hi dAIsy! How can you help me?",
    icon: Sparkles,
  },
  {
    id: "find-contact",
    label: "Find contact info for someone",
    prompt: "Find contact info for Gustavo Favaron of GRI Institute",
    icon: Search,
  },
  {
    id: "get-ceo-email",
    label: "Get email of a CEO",
    prompt: "Get the CEO email from GRI Institute company",
    icon: Mail,
  },
  {
    id: "research-company",
    label: "Research a company",
    prompt: "Research GRI Institute and provide a summary of their business",
    icon: FileText,
  },
  {
    id: "similar-companies",
    label: "Similar companies",
    prompt: "Companies similar to Brookfield",
    icon: Building2,
  },
  {
    id: "market-trends",
    label: "Market trends",
    prompt: "PropTech trends in Europe",
    icon: TrendingUp,
  },
  {
    id: "company-news",
    label: "Company recent news",
    prompt: "Recent news on Blackstone",
    icon: Newspaper,
  },
  {
    id: "top-engaged",
    label: "Top engaged members",
    prompt: "Show top engaged members",
    icon: Users,
  },
  {
    id: "renewal-process",
    label: "Renewal process",
    prompt: "How does renewal process work?",
    icon: RefreshCw,
  },
  {
    id: "referral-process",
    label: "Referral process",
    prompt: "What is the referral process?",
    icon: UserPlus,
  },
];

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  onHoverPrompt?: (prompt: string | null) => void;
}

export function SuggestedPrompts({ onSelectPrompt, onHoverPrompt }: SuggestedPromptsProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-8">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {suggestedPrompts.map((prompt, index) => {
          const Icon = prompt.icon;
          const isHighlighted = prompt.id === "know-daisy";
          return (
            <motion.button
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPrompt(prompt.prompt)}
              onMouseEnter={() => onHoverPrompt?.(prompt.prompt)}
              onMouseLeave={() => onHoverPrompt?.(null)}
              className={
                isHighlighted
                  ? "col-span-full mx-auto flex max-w-sm items-center gap-3 rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-2 text-left shadow-md transition-all hover:border-blue-500 hover:shadow-lg"
                  : "flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-2 text-left shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
              }
            >
              <div
                className={
                  isHighlighted
                    ? "flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 p-2"
                    : "flex-shrink-0 rounded-lg bg-gray-100 p-2"
                }
              >
                <Icon
                  className={
                    isHighlighted
                      ? "h-5 w-5 text-white"
                      : "h-5 w-5 text-gray-700"
                  }
                />
              </div>
              <div className="flex-1">
                <p
                  className={
                    isHighlighted
                      ? "text-sm font-semibold text-gray-900"
                      : "text-sm font-medium text-gray-900"
                  }
                >
                  {prompt.label}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
