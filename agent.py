import os
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIResponsesModel
from pydantic_ai.providers.openai import OpenAIProvider

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
OPENAI_EMBEDDING_MODEL = "text-embedding-ada-002"
OPENAI_INFERENCE_MODEL = "gpt-4o-mini"

rag_model = OpenAIResponsesModel(
    OPENAI_INFERENCE_MODEL,
    provider=OpenAIProvider(
        api_key=os.environ.get("OPENAI_API_KEY"),
        base_url="https://api.openai.com/v1/",
    ),
)

agent = Agent(rag_model, instructions="Be fun!")
app = agent.to_ag_ui()
# If you want the server to run on invocation, you can do the following:
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)
