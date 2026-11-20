FROM node:24

RUN npm install -g pnpm
RUN apt-get update && apt-get install -y supervisor
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
COPY pyproject.toml uv.lock .python-version ./
RUN uv sync


COPY client/package.json client/pnpm-lock.yaml client/pnpm-workspace.yaml /client/
RUN pnpm --prefix client ci

COPY client/ client/
RUN pnpm --prefix client run build 


# Copy docs contents and populate RAG
COPY --from=taccwma/tacc-docs:latest /docs/ /docs/
COPY scripts/ /scripts/
COPY agent.py /agent.py
# OPENAI_API_KEY secret is needed here in order to call OpenAI for doc embeddings
RUN --mount=type=secret,id=env uv run --env-file=/run/secrets/env scripts/setup_chromadb.py

EXPOSE 8888
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

ENV COPILOTKIT_TELEMETRY_DISABLED=true

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
