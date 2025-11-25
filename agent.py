import os
import chromadb
import pydantic
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIResponsesModel
from pydantic_ai.providers.openai import OpenAIProvider

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
OPENAI_INFERENCE_MODEL = os.environ.get("OPENAI_INFERENCE_MODEL", "gpt-4o-mini")

client = chromadb.PersistentClient()
collection = client.get_collection("taccdoc_rag")


class RagDocument(pydantic.BaseModel):
    text: str
    url: str
    title: str


rag_model = OpenAIResponsesModel(
    OPENAI_INFERENCE_MODEL,
    provider=OpenAIProvider(
        api_key=os.environ.get("OPENAI_API_KEY"),
        base_url="https://api.openai.com/v1/",
    ),
)


instructions = """
You are a research assistant with the task of assisting users with questions about TACC documentation.
Cite your sources using the provided URLs. Provide detailed instructions and code samples where possible. 
Format responses in markdown with properly formatted code blocks.
"""

rag_agent = Agent(rag_model, instrument=False, instructions=instructions)


@rag_agent.tool_plain
def documentation_lookup(query: str) -> list[RagDocument]:
    docs_res = []
    query_resp = collection.query(query_texts=[query])
    docs = query_resp["documents"][0]
    metas = query_resp["metadatas"][0]
    for text, meta in zip(docs, metas):
        docs_res.append(RagDocument(text=text, url=meta["url"], title=meta["title"]))

    return docs_res


app = rag_agent.to_ag_ui()
# If you want the server to run on invocation, you can do the following:
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
