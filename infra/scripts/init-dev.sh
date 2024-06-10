#!/bin/bash

function cleanup {
    npm run services:down
    exit 0
}

trap cleanup INT

npm run services:up  && npm run wait-for-postgres && npm run migration:up && next dev