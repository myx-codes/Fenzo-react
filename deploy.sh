#!/bin/bash

# PRODUCTION
# git reset --hard
# git checkout main
# git pull origin main

# docker compose up -d

npm i yarn -g
yarn global add serve
yarn 
yarn run build
pm2 start "yarn run start:prod" --name=Fenzo_react
