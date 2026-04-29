import "./globals.css";
import { ReactNode } from "react";
import { CopilotKit } from "@copilotkit/react-core";
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* This points to the runtime we setup in the previous step */}
        <CopilotKit
          runtimeUrl="/api/copilotkit"
          agent="my_agent"
          enableInspector={false}
        >
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}
