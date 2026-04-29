"use client";
import "@copilotkit/react-ui/v2/styles.css";
import {
  CopilotChat,
  CopilotChatAssistantMessage,
} from "@copilotkit/react-core/v2";
import { useEffect, useRef, useState } from "react";
import { Check, ThumbsUp, ThumbsDown } from "lucide-react";
import { useCopilotChat } from "@copilotkit/react-core";

export const ThumbsUpButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, title, onClick, ...props }) => {
  const [clicked, setClicked] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      await Promise.resolve(onClick(event));
    }

    setClicked(true);
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setClicked(false);
    }, 2000);
  };

  return (
    <CopilotChatAssistantMessage.ToolbarButton
      data-testid="copilot-thumbsup-button"
      title={title || "Good Response"}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {clicked ? (
        <Check className="cpk:size-[18px]" />
      ) : (
        <ThumbsUp className="cpk:size-[18px]" />
      )}
    </CopilotChatAssistantMessage.ToolbarButton>
  );
};

export const ThumbsDownButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, title, onClick, ...props }) => {
  const [clicked, setClicked] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      await Promise.resolve(onClick(event));
    }

    setClicked(true);
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setClicked(false);
    }, 2000);
  };

  return (
    <CopilotChatAssistantMessage.ToolbarButton
      data-testid="copilot-thumbsdown-button"
      title={title || "Bad Response"}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {clicked ? (
        <Check className="cpk:size-[18px]" />
      ) : (
        <ThumbsDown className="cpk:size-[18px]" />
      )}
    </CopilotChatAssistantMessage.ToolbarButton>
  );
};

export function AgentApp() {
  const { isLoading } = useCopilotChat();
  return (
    <CopilotChat
    className="cpk:whitespace-pre"
      labels={{
        welcomeMessageText:
          "Welcome to the TACC Documentation RAG (Beta). How can I help?",
      }}
      input={{
        textArea: {
          disabled: isLoading,
          className: isLoading ? "opacity-50 cursor-not-allowed" : "",
        },
      }}
      messageView={{
        assistantMessage: {
          onThumbsDown: (msg) => console.log(msg),
          onThumbsUp: (msg) => console.log(msg),
          thumbsUpButton: ThumbsUpButton,
          thumbsDownButton: ThumbsDownButton,
        },
      }}
    />
  );
}

export default function Home() {
  return <AgentApp />;
}
