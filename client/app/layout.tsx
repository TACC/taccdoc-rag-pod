import "./globals.css";
import { ReactNode } from "react";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { CopilotKit } from "@copilotkit/react-core/v2";

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
          useSingleEndpoint={false}
        >
          <Toaster />
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}
