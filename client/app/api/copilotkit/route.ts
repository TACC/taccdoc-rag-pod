import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { HttpAgent } from "@ag-ui/client";
import { NextRequest } from "next/server";

// 1. You can use any service adapter here for multi-agent support. We use
//    the empty adapter since we're only using one agent.
const serviceAdapter = new ExperimentalEmptyAdapter();
const agentId = process.env.COPILOTKIT_AGENT_ID ?? "my_agent";
const agentUrl = process.env.AG_UI_AGENT_URL ?? "http://0.0.0.0:8000/";

// 2. Create the CopilotRuntime instance and utilize the PydanticAI AG-UI
//    integration to setup the connection.
const runtime = new CopilotRuntime({
  agents: {
    [agentId]: new HttpAgent({ url: agentUrl }),
  },
});

// 3. Build a Next.js API route that handles the CopilotKit runtime requests.
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
