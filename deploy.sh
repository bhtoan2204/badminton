#!/bin/bash

export TAG=latest

docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml push
