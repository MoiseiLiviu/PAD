#!/bin/bash

if [ "$#" -lt 2 ]; then
    echo "Usage: $0 <DOCKER_USERNAME> <IMAGE_NAME> <deployment-name>"
    exit 1
fi

DOCKER_USERNAME="$1"
IMAGE_NAME="$2"
DEPLOYMENT_NAME="$3"
LOCAL_IMAGE_TAG=$(date +"%Y%m%d%H%M%S")
DOCKERHUB_IMAGE_TAG="${DOCKER_USERNAME}/${IMAGE_NAME}:${LOCAL_IMAGE_TAG}"
KUBE_NAMESPACE="default"

docker build -t "${LOCAL_IMAGE_TAG}" .

docker tag "${LOCAL_IMAGE_TAG}" "${DOCKERHUB_IMAGE_TAG}"
docker push "${DOCKERHUB_IMAGE_TAG}"

kubectl set image deployment/"${DEPLOYMENT_NAME}" "${DEPLOYMENT_NAME}"="${DOCKERHUB_IMAGE_TAG}" -n ${KUBE_NAMESPACE}
