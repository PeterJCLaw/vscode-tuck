#!/bin/sh -e

cd $(dirname $0)

python3.5 -m venv venv
. venv/bin/activate

pip install --upgrade pip pip-tools

pip-compile

pip uninstall --yes pip-tools

# Install the depdencies into `lib`, requiring that we're platform agnostic.
# Note: we assume that all dependencies are explicitly present in `requirements.txt`.
pip install \
    --requirement requirements.txt \
    --target lib \
    --implementation py \
    --no-deps \
    --upgrade
