#!/bin/bash

apt update
apt -y upgrade
npm install -g npm@latest

if [ ! -f "/medusa" ]
then
  git clone https://github.com/contrebande-labs/medusa-starter
  cd medusa-starter
  npm i
  npx medusa telemetry --disable
  npx medusa seed -f ./data/seed.json
  npx medusa user --email "${ADMIN_USER_EMAIL}" --password "${ADMIN_USER_PASSWORD}"
  npx medusa start
else
  cd medusa
  git pull
  npm i
  npx medusa telemetry --disable
  npx medusa start
fi
