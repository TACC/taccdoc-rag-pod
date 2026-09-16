"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { ReactNode } from "react";

interface CopilotProviderProps {
  agentId: string;
  children: ReactNode;
}

export function CopilotProvider({ agentId, children }: CopilotProviderProps) {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      agent={agentId}
      enableInspector={false}
    >
      {children}
    </CopilotKit>
  );
}
