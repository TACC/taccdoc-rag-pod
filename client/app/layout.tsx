import "./globals.css";
import { ReactNode } from "react";
import { CopilotKit } from "@copilotkit/react-core";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        {/* This points to the runtime we setup in the previous step */}
        <CopilotKit
          runtimeUrl="/api/copilotkit"
          agent="my_agent"
          enableInspector={false}
        >
          {children}
        </CopilotKit>
        <Toaster />
      </body>
    </html>
  );
}
