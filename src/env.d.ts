declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_ASSISTANT_ID: string;
    NEXT_PUBLIC_HIDE_TOOL_RESULTS?: string;
    LANGSMITH_API_KEY?: string;
    LANGGRAPH_API_URL?: string;
  }
}
