#!/usr/bin/env bash

set -e

echo "building ..."

cd packages/utils && yarn build
cd ../styles && yarn build
cd ../react && yarn build
cd ../processor && yarn build
cd ../react && yarn build
cd ../cli && yarn build

cd ../..

echo "preparing release ..."

lerna version --conventional-commits $1

