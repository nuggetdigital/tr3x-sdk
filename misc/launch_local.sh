#!/bin/bash

here_dir=$(dirname ${BASH_SOURCE[0]})

if ! stat $here_dir/moonbeam > /dev/null 2>&1; then
  curl \
    -sSfL \
    https://github.com/nuggetdigital/moonbeam-binary/releases/download/v0.7.0/moonbeam-v0.7.0-ubuntu-20.04.gz \
  | gunzip \
  > $here_dir/moonbeam

  chmod +x $here_dir/moonbeam
fi

$here_dir/moonbeam \
  --no-telemetry \
  --no-prometheus \
  --port 19419 \
  --rpc-port 19420 \
  --ws-port 1921 \
  --dev \
> /dev/null 2>&1 &

if (($? == 0)); then
  echo "moonbeam launched"
  exit 0
else
  echo "moonbeam crashed" 1>&2
  exit 1
fi
