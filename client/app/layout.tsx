import "./globals.css";
import { ReactNode } from "react";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { CopilotProvider } from "./copilot-provider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({ children }: { children: ReactNode }) {
  const agentId = process.env.COPILOTKIT_AGENT_ID ?? "my_agent";

  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <CopilotProvider agentId={agentId}>
          <Toaster />
          {children}
        </CopilotProvider>
      </body>
    </html>
  );
}
