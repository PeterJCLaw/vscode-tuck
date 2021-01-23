#!/bin/sh -e

cd $(dirname $0)

rm requirements.txt

exec ./install-requirements.sh
