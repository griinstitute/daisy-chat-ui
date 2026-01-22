import { Button } from "@/components/ui/button";
import { useThreads } from "@/providers/Thread";
import { Thread } from "@langchain/langgraph-sdk";
import { useEffect, useState } from "react";

import { getContentString } from "../utils";
import { useQueryState, parseAsBoolean } from "nuqs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PanelRightOpen,
  PanelRightClose,
  Trash2,
  LoaderCircle,
} from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { createClient } from "@/providers/client";
import { getApiKey } from "@/lib/api-key";
import { toast } from "sonner";

function ThreadList({
  threads,
  onThreadClick,
  onDeleteThread,
  deletingThreadId,
}: {
  threads: Thread[];
  onThreadClick?: (threadId: string) => void;
  onDeleteThread?: (threadId: string) => void;
  deletingThreadId?: string | null;
}) {
  const [threadId, setThreadId] = useQueryState("threadId");

  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-2 overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
      {threads.map((t) => {
        let itemText = t.thread_id;
        if (
          typeof t.values === "object" &&
          t.values &&
          "messages" in t.values &&
          Array.isArray(t.values.messages) &&
          t.values.messages?.length > 0
        ) {
          const firstMessage = t.values.messages[0];
          itemText = getContentString(firstMessage.content);
        }
        return (
          <div
            key={t.thread_id}
            className="flex w-full justify-between px-1"
          >
            <Button
              variant="ghost"
              className="w-[280px] items-start justify-start text-left font-normal"
              onClick={(e) => {
                e.preventDefault();
                onThreadClick?.(t.thread_id);
                if (t.thread_id === threadId) return;
                setThreadId(t.thread_id);
              }}
            >
              <p className="truncate text-ellipsis">{itemText}</p>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hover:text-destructive"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDeleteThread?.(t.thread_id);
              }}
              disabled={deletingThreadId === t.thread_id}
            >
              {deletingThreadId === t.thread_id ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        );
      })}
    </div>
  );
}

function ThreadHistoryLoading() {
  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-2 overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
      {Array.from({ length: 30 }).map((_, i) => (
        <Skeleton
          key={`skeleton-${i}`}
          className="h-10 w-[280px]"
        />
      ))}
    </div>
  );
}

export default function ThreadHistory() {
  const envApiUrl: string | undefined = process.env.NEXT_PUBLIC_API_URL;

  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [chatHistoryOpen, setChatHistoryOpen] = useQueryState(
    "chatHistoryOpen",
    parseAsBoolean.withDefault(false),
  );

  const { getThreads, threads, setThreads, threadsLoading, setThreadsLoading } =
    useThreads();

  const [threadId, setThreadId] = useQueryState("threadId");
  const [apiUrl] = useQueryState("apiUrl", { defaultValue: envApiUrl || "" });
  const [token] = useQueryState("token");
  const [deletingThreadId, setDeletingThreadId] = useState<string | null>(null);

  const handleDeleteThread = async (threadIdToDelete: string) => {
    if (!apiUrl) {
      toast.error("Fail on thread delete", {
        description: "API url not set",
      });
      return;
    }

    setDeletingThreadId(threadIdToDelete);

    try {
      const client = createClient(
        apiUrl,
        getApiKey() ?? undefined,
        token ?? undefined,
      );

      await client.threads.delete(threadIdToDelete);

      if (threadIdToDelete === threadId) {
        setThreadId(null);
      }

      setThreads((prev) =>
        prev.filter((t) => t.thread_id !== threadIdToDelete),
      );
    } catch (error: any) {
      toast.error("Falha ao deletar thread", {
        description: error.message || "Erro desconhecido",
      });
    } finally {
      setDeletingThreadId(null);
    }
  };

  useEffect(() => {
    console.log("b");
    if (typeof window === "undefined") return;
    console.log("c");
    setThreadsLoading(true);
    getThreads()
      .then(setThreads)
      .catch(console.error)
      .finally(() => setThreadsLoading(false));
  }, []);

  return (
    <>
      <div className="shadow-inner-right hidden h-screen w-[300px] shrink-0 flex-col items-start justify-start gap-6 border-r-[1px] border-slate-300 lg:flex">
        <div className="flex w-full items-center justify-between px-4 pt-1.5">
          <Button
            className="hover:bg-gray-100"
            variant="ghost"
            onClick={() => setChatHistoryOpen((p) => !p)}
          >
            {chatHistoryOpen ? (
              <PanelRightOpen className="size-5" />
            ) : (
              <PanelRightClose className="size-5" />
            )}
          </Button>
          <h1 className="text-xl font-semibold tracking-tight">
            Thread History
          </h1>
        </div>
        {threadsLoading ? (
          <ThreadHistoryLoading />
        ) : (
          <ThreadList
            threads={threads}
            onDeleteThread={handleDeleteThread}
            deletingThreadId={deletingThreadId}
          />
        )}
      </div>
      <div className="lg:hidden">
        <Sheet
          open={!!chatHistoryOpen && !isLargeScreen}
          onOpenChange={(open) => {
            if (isLargeScreen) return;
            setChatHistoryOpen(open);
          }}
        >
          <SheetContent
            side="left"
            className="flex lg:hidden"
          >
            <SheetHeader>
              <SheetTitle>Thread History</SheetTitle>
            </SheetHeader>
            <ThreadList
              threads={threads}
              onThreadClick={() => setChatHistoryOpen((o) => !o)}
              onDeleteThread={handleDeleteThread}
              deletingThreadId={deletingThreadId}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
