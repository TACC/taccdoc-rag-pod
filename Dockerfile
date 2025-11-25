FROM node:22

RUN apt-get update && apt-get install -y supervisor
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
COPY pyproject.toml uv.lock .python-version ./
RUN uv sync


COPY client/package.json client/package-lock.json /client/
RUN npm --prefix client ci

COPY client/ client/
RUN npm run build --prefix client


# Copy docs contents and populate RAG
COPY --from=taccwma/tacc-docs:latest /docs/ /docs/
COPY scripts/ /scripts/
COPY agent.py /agent.py
# OPENAI_API_KEY secret is needed here in order to call OpenAI for doc embeddings
RUN --mount=type=secret,id=env uv run --env-file=/run/secrets/env scripts/setup_chromadb.py

EXPOSE 8888
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
