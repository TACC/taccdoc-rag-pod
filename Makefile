include .env.deploy

.PHONY: build
build:
	docker build --secret id=env,src=.env  -t $(DOCKER_IMAGE_TAG) .

.PHONY: start
start:
	docker run -p 8888:8888 --rm -v "$(CURDIR)/.env:/mnt/data/.env:ro" $(DOCKER_IMAGE_TAG)

.PHONY: start-dev
start-dev:
	docker run -p 8888:8888 --rm -v "$(CURDIR)/.env:/mnt/data/.env:ro" -v "$(CURDIR)/supervisord.dev.conf:/etc/supervisor/conf.d/supervisord.conf:ro" -v "$(CURDIR)/client/app:/client/app" -v "$(CURDIR)/client/components:/client/components" $(DOCKER_IMAGE_TAG)

.PHONY: push
push:
	docker push $(DOCKER_IMAGE_TAG)

.PHONY: deploy-pod
deploy-pod:
	uv run --no-project --with "tapipy>=1.9.1,<2.0" --env-file=.env.deploy scripts/setup_pod.py

.PHONY: check-pod
check-pod:
	uv run --no-project --with "tapipy>=1.9.1,<2.0" --env-file=.env.deploy scripts/check_pod.py
