#!/bin/bash

remove_containers() {
  CONTAINERS=$(docker ps -aq)
  if [ -n "$CONTAINERS" ]; then
    echo "Removing Docker containers..."
    docker rm -f $CONTAINERS
  else
    echo "No Docker containers to remove."
  fi
}

remove_volumes() {
  VOLUMES=$(docker volume ls -q)
  if [ -n "$VOLUMES" ]; then
    echo "Removing Docker volumes..."
    docker volume rm $VOLUMES
  else
    echo "No Docker volumes to remove."
  fi
}

remove_images() {
  IMAGES=$(docker images -q)
  if [ -n "$IMAGES" ]; then
    echo "Removing Docker images..."
    docker rmi -f $IMAGES
  else
    echo "No Docker images to remove."
  fi
}

remove_networks() {
  PREDEFINED_NETWORKS="bridge host none ingress docker_gwbridge"
  NETWORKS=$(docker network ls -q)
  if [ -n "$NETWORKS" ]; then
    echo "Removing Docker networks..."
    for NETWORK in $NETWORKS; do
      NETWORK_NAME=$(docker network inspect -f '{{.Name}}' $NETWORK)
      if [[ ! " $PREDEFINED_NETWORKS " =~ " $NETWORK_NAME " ]]; then
        docker network rm $NETWORK || echo "Failed to remove network $NETWORK_NAME. It may have active endpoints."
      else
        echo "Skipping predefined network: $NETWORK_NAME"
      fi
    done
  else
    echo "No Docker networks to remove."
  fi
}

remove_containers
remove_volumes
remove_images
remove_networks

echo "Docker purge completed!"
