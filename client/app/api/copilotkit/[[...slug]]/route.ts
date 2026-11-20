import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { HttpAgent } from "@ag-ui/client";

// 1. You can use any service adapter here for multi-agent support. We use
//    the empty adapter since we're only using one agent.

// 2. Create the CopilotRuntime instance and utilize the PydanticAI AG-UI
//    integration to setup the connection.
const runtime = new CopilotRuntime({
  agents: {
    // @ts-expect-error -- pnpm resolves HttpAgent and AbstractAgent with different Zod peers.
    my_agent: new HttpAgent({ url: "http://0.0.0.0:8000/" }),
  },
  identifyUser: (request) => ({
    id: request.headers.get("x-user-id") ?? "anonymous",
    name: request.headers.get("x-user-name") ?? "Anonymous",
  }),
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit",
});
export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;
