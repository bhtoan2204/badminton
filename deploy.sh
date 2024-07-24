#!/bin/bash

export TAG=latest

docker-compose -f docker-compose.prod1.yml build
docker-compose -f docker-compose.prod1.yml push
docker-compose -f docker-compose.prod2.yml build
docker-compose -f docker-compose.prod2.yml push
docker-compose -f docker-compose.prod3.yml build
docker-compose -f docker-compose.prod3.yml push
docker-compose -f docker-compose.prod4.yml build
docker-compose -f docker-compose.prod4.yml push
docker-compose -f docker-compose.prod5.yml build
docker-compose -f docker-compose.prod5.yml push
docker-compose -f docker-compose.prod6.yml build
docker-compose -f docker-compose.prod6.yml push
docker-compose -f docker-compose.prod7.yml build
docker-compose -f docker-compose.prod7.yml push
docker-compose -f docker-compose.prod8.yml build
docker-compose -f docker-compose.prod8.yml push
