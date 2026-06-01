include .env.deploy

.PHONY: build
build:
	docker build --secret id=env,src=.env  -t $(DOCKER_IMAGE_TAG) .

.phony: start
start: 
	docker run  -p 8888:8888  --rm  -v .env:/mnt/data/.env $(DOCKER_IMAGE_TAG)

.phony: start-dev
start-dev: 
	docker run  -p 8888:8888  --rm  -v .env:/mnt/data/.env -v ./supervisord.dev.conf:/etc/supervisor/conf.d/supervisord.conf -v ./client/app:/client/app -v ./client/components:/client/components $(DOCKER_IMAGE_TAG)

.phony: push
push:
	docker push $(DOCKER_IMAGE_TAG)

.phony: deploy-pod
deploy-pod:
	uv run --env-file=.env.deploy scripts/setup_pod.py

.phony: check-pod
check-pod:
	uv run --env-file=.env.deploy scripts/check_pod.py
