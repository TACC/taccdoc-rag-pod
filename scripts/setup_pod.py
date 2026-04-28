import os
from typing import Literal
from tapipy.tapis import Tapis

ENV_PATH = os.environ.get("ENV_FILE", "./.env")
TAPIS_TENANT_URL = os.environ.get("TAPIS_TENANT_URL", "https://tacc.tapis.io")
OPERATION: Literal["CREATE", "UPDATE"] = os.environ.get("OPERATION", "UPDATE")
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
    tapis_token = t.access_token.access_token

    existing_pod = next((p for p in t.pods.list_pods() if p.pod_id == POD_ID), None)
    existing_volume = next(
        (v for v in t.pods.list_volumes() if v.volume_id == VOLUME_ID), None
    )

    if not existing_volume:
        t.pods.create_volume(
            volume_id=VOLUME_ID, description="env file", size_limit=1024
        )

    with open(ENV_PATH) as file:
        print(f"uploading env file to volume {VOLUME_ID}")
        t.pods.upload_to_volume(volume_id=VOLUME_ID, path=".env", file=file)
        print(f"volume contents:\n{t.pods.list_volume_files(volume_id=VOLUME_ID)} ")

    if existing_pod:
        print(f"Restarting and updating pod {POD_ID}")
        t.pods.update_pod(
            pod_id=POD_ID,
            networking={"default": {"protocol": "http", "port": 8888}},
            time_to_stop_default=-1,
            volume_mounts={
                VOLUME_ID: {
                    "type": "tapisvolume",
                    "mount_path": "/mnt/data",
                }
            },
        )
        t.pods.restart_pod(pod_id=POD_ID)
        print(f"Pod Info:\n{t.pods.get_pod(pod_id=POD_ID)}")

    else:
        print(f"Creating pod {POD_ID} with image {DOCKER_IMAGE_TAG}")
        t.pods.create_pod(
            pod_id=POD_ID,
            image=DOCKER_IMAGE_TAG,
            networking={"default": {"protocol": "http", "port": 8888}},
            time_to_stop_default=-1,
            volume_mounts={
                VOLUME_ID: {
                    "type": "tapisvolume",
                    "mount_path": "/mnt/data",
                }
            },
        )
        print(f"Pod Info:\n{t.pods.get_pod(pod_id=POD_ID)}")


if __name__ == "__main__":
    main()
