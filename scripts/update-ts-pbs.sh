#!/bin/bash
. $(dirname "$0")/common.sh

protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./src/app/proto -Ithird_party -I$1 $2