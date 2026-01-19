import { Client } from "@langchain/langgraph-sdk";

export function createClient(
  apiUrl: string,
  apiKey: string | undefined,
  token: string | undefined,
) {
  return new Client({
    apiKey,
    apiUrl,
    defaultHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}
