"use client";
import "@copilotkit/react-ui/v2/styles.css";
import {
  CopilotChat,
  CopilotChatAssistantMessage,
  useAgent,
} from "@copilotkit/react-core/v2";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Popover as PopoverPrimitive } from "radix-ui";
import { Textarea } from "@/components/ui/textarea";
//import { toast } from "sonner";

const FeedbackPopover: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ onClick, children }) => {
  const [feedback, setFeedback] = useState<string>("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  function triggerClick(evt: React.MouseEvent<HTMLButtonElement>) {
    if (onClick) onClick(evt);
    console.log(feedback);
    if (buttonRef.current) buttonRef.current.click();
    setFeedback("");
    //toast.success("Your feedback has been recorded.", {position: "bottom-left"})
  }
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>
        <Textarea
          value={feedback}
          placeholder="(Optional) Please give feedback about the response or how it could be improved."
          onChange={(e) => setFeedback(e.target.value)}
          className="resize-none"
        />
        <PopoverPrimitive.Close asChild>
          <Button className="hidden" ref={buttonRef}>
            close
          </Button>
        </PopoverPrimitive.Close>
        <Button onClick={triggerClick}>Submit Feedback</Button>
      </PopoverContent>
    </Popover>
  );
};

export function AgentApp() {
  const { agent } = useAgent({ agentId: "my_agent" });
  return (
    <CopilotChat
      className="cpk:whitespace-pre"
      labels={{
        welcomeMessageText:
          "Welcome to the TACC Documentation RAG (Beta). How can I help?",
      }}
      input={{
        textArea: {
          disabled: agent.isRunning,
          className: agent.isRunning ? "opacity-50 cursor-not-allowed" : "",
        },
      }}
      messageView={{
        assistantMessage: {
          onThumbsDown: () => console.log(agent.messages),
          onThumbsUp: () => console.log(agent.messages),
          thumbsUpButton: (props) => (
            <FeedbackPopover {...props}>
              <CopilotChatAssistantMessage.ThumbsUpButton />
            </FeedbackPopover>
          ),
          thumbsDownButton: (props) => (
            <FeedbackPopover {...props}>
              <CopilotChatAssistantMessage.ThumbsDownButton />
            </FeedbackPopover>
          ),
        },
      }}
    />
  );
}

export default function Home() {
  return <AgentApp />;
}
