#!/bin/sh -e

cd $(dirname $0)

python3 -m venv venv
. venv/bin/activate

pip install --upgrade pip

# Install the depdencies into `lib`, requiring that we're platform agnostic
pip install \
    --requirement tuck/requirements.txt \
    --target lib \
    --implementation py \
    --upgrade
