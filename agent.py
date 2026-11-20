import os

import chromadb
import pydantic
from fastapi import FastAPI, Request, Response
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.providers.litellm import LiteLLMProvider
from pydantic_ai.ui.ag_ui import AGUIAdapter

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
OPENAI_INFERENCE_MODEL = os.environ.get("OPENAI_INFERENCE_MODEL", "DeepSeek-V3.2")

client = chromadb.PersistentClient()
collection = client.get_collection("taccdoc_rag")


class RagDocument(pydantic.BaseModel):
    text: str
    url: str
    title: str


rag_model = OpenAIChatModel(
    OPENAI_INFERENCE_MODEL,
    provider=LiteLLMProvider(
        api_key=os.environ.get("INFERENCE_API_KEY"),
        api_base=os.environ.get(
            "INFERENCE_BASE_URL", "https://ai.tejas.tacc.utexas.edu"
        ),
    ),
)


instructions = """
You are a research assistant with the task of assisting users with questions about TACC documentation.
Cite your sources using the provided URLs. Provide detailed instructions and code samples where possible. 
Format responses in markdown with properly formatted code blocks.
"""

agent = Agent(rag_model, instructions=instructions)


@agent.tool_plain
def documentation_lookup(query: str) -> list[RagDocument]:
    docs_res = []
    query_resp = collection.query(query_texts=[query])
    docs = query_resp["documents"][0]
    metas = query_resp["metadatas"][0]
    for text, meta in zip(docs, metas):
        docs_res.append(RagDocument(text=text, url=meta["url"], title=meta["title"]))

    return docs_res


app = FastAPI()


@app.post("/")
async def run_agent(request: Request) -> Response:
    return await AGUIAdapter.dispatch_request(request, agent=agent)
