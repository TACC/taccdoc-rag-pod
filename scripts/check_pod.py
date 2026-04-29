import os
from tapipy.tapis import Tapis

ENV_PATH = os.environ.get("ENV_FILE", "./.env")
TAPIS_TENANT_URL = os.environ.get("TAPIS_TENANT_URL", "https://tacc.tapis.io")
POD_ID = os.environ.get("POD_ID")
VOLUME_ID = os.environ.get("VOLUME_ID")
DOCKER_IMAGE_TAG = os.environ.get("DOCKER_IMAGE_TAG")


def main():

    t = Tapis(
        base_url=TAPIS_TENANT_URL,
        username=os.environ.get("TAPIS_USERNAME"),
        password=os.environ.get("TAPIS_PASSWORD"),
    )
    t.get_tokens()

    print(t.pods.get_pod(pod_id=POD_ID))


if __name__ == "__main__":
    main()
