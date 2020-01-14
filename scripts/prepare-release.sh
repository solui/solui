#!/usr/bin/env bash

set -e

cd packages/utils && yarn build
cd ../styles && yarn build
cd ../react && yarn build
cd ../processor && yarn build
cd ../react && yarn build
cd ../cli && yarn build

cd ../..

lerna version --conventional-commits $1

