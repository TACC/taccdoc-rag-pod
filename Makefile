include .env.deploy

.PHONY: build
build:
	docker build --secret id=env,src=.env  -t $(DOCKER_IMAGE_TAG) .

.phony: start
start: 
	docker run  -p 8888:8888  --rm  -v .env:/mnt/data/.env $(DOCKER_IMAGE_TAG)

.phony: push
push:
	docker push $(DOCKER_IMAGE_TAG)

.phony: deploy-pod
deploy-pod:
	uv run --env-file=.env.deploy scripts/setup_pod.py
