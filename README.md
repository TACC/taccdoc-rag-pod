# Tapis Pod Deployment for Taccdoc RAG

## Overview
This repo contains code and tooling for deploying an agentic application to the Tapis Pods service. The specific application demonstrated here is a RAG chatbot pointed at TACC's HPC documentation (https://docs.tacc.utexas.edu), but the methods should be broadly applicable to any agent that supports the [AG-UI protocol
](https://docs.ag-ui.com/).
### Architecture
The Dockerfile builds an image that, when run, serves a NextJS application with a chatbot powered by Copilotkit. The chatbot is backed by a Pydantic-AI agent that searches a ChromaDB vector database containing the contents of TACC's technical documentation. To make the image as portable as possible, the database is populated at build time and run in-process. The NextJS frontend and Pydantic-AI backend are run in the same container, with the processes managed by supervisord (to change the runtime config, edit `supervisord.conf`).

## Repository Setup
1. Before you start, you should have the following credentials handy:
    - A valid OpenAI API key
    - The username/password for your TACC account ([register here](https://accounts.tacc.utexas.edu/register))

    You should also have the following installed on your local machine:
    - [uv](https://docs.astral.sh/uv/getting-started/installation/)
    - [NodeJS 22 with npm](https://nodejs.org/en/download)
    - [Docker](https://www.docker.com/get-started/) (to push images you will need to be looged into DockerHub or another container registry)
1. Copy the environment files to your local machine:
    ```
    cp .env.sample .env
    cp .env.deploy .env.deploy
    ```
1. Update your `.env` and `.env.deploy` with your OpenAI and TACC credentials where indicated.

## Running Locally
A Makefile is provided with several convenience methods. To serve the application locally, run the following:
```
uv sync
make build
make start
```
Upon running `make start` you should see output like this in your terminal:
```
> client@0.1.0 start
> next start -H 0.0.0.0 -p 8888

   ▲ Next.js 15.5.6
2025-11-25 15:22:39,017 INFO success: client entered RUNNING state, process has stayed up for > than 1 seconds (startsecs)
2025-11-25 15:22:39,017 INFO success: server entered RUNNING state, process has stayed up for > than 1 seconds (startsecs)
   - Local:        http://localhost:8888
   - Network:      http://0.0.0.0:8888

 ✓ Starting...
 ✓ Ready in 1187ms
INFO:     Started server process [23]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

## Deploying to Tapis Pods
> [!WARNING]
> Following these instructions will deploy an application to the public internet using the [Tapis Pods service](https://tapis.readthedocs.io/en/latest/technical/pods.html).

1. Run `docker login` and make sure that you are signed in to a valid Dockerhub account.
1. Edit `.env.deploy` with a custom `DOCKER_IMAGE_TAG` for your deployment. Enter a custom `POD_ID` and `VOLUME_ID` to use within the Tapis Pods service. (these should be lowercase alphanumeric). Double check your Tapis credentials here as well.
1. Run the following to deploy your image to the Pods service:

    ```
    uv sync
    Make build
    make push
    make deploy-pod
    ```
The `deploy-pod` command creates a pod with `.env` mounted at `/mnt/data/.env`. If the pod with ID `POD_ID` already exists, it will be updated and restarted.

## Custom development
This repo is meant to be easily forked to deploy custom agents/chatbots. To customize this repo, you should start in the following places:

- To set up a custom agent, edit `agent.py` and replace `agent` with your own Pydantic-AI agent ([see docs](https://ai.pydantic.dev/))
- To customize the frontend, edit `client/app/page.tsx` with your desired Copilotkit components ([see docs](https://docs.copilotkit.ai/pydantic-ai))


