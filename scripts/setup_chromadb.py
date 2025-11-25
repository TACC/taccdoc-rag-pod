import os
import uuid
import chromadb
import chromadb.utils.embedding_functions as embedding_functions
from process_mkdocs import process_markdown_files

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
OPENAI_EMBEDDING_MODEL = os.environ.get(
    "OPENAI_EMBEDDING_MODEL", "text-embedding-ada-002"
)

CHROMA_COLLECTION_NAME = "taccdoc_rag"


def main():
    openai_ef = embedding_functions.OpenAIEmbeddingFunction(
        api_key=OPENAI_API_KEY, model_name=OPENAI_EMBEDDING_MODEL
    )
    chroma_client = chromadb.PersistentClient(path="/chroma")
    collection = chroma_client.get_or_create_collection(
        CHROMA_COLLECTION_NAME, embedding_function=openai_ef
    )

    docs = process_markdown_files()
    # def embed_documents(chunk_size=100):
    chunk_size = 100
    docs_slice = slice(0, chunk_size)
    while docs_chunk := docs[docs_slice]:
        documents = [d.text for d in docs_chunk]
        metadata = [d.metadata for d in docs_chunk]

        ids = [str(uuid.uuid4()) for d in documents]
        collection.add(documents=documents, metadatas=metadata, ids=ids)

        print(f"indexed embeddings for slice {docs_slice.start}-{docs_slice.stop}")

        docs_slice = slice(docs_slice.stop, docs_slice.stop + chunk_size)


if __name__ == "__main__":
    main()
