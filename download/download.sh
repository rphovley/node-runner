#!/usr/bin/env sh
set -e
# check for params
while getopts b:e:a: flag; do
  case "${flag}" in
  b) brand=${OPTARG} ;;
  e) env=${OPTARG} ;;
  a) arch=${OPTARG} ;;
  esac
done
if [[ -z "$brand" ]]; then
  echo "ERR: brand variable required, use '-b {BRAND}' and optionally add an environment variable '-e {ENV}'"
  exit
fi
# ensure string is lowercase
brand=$(echo "$brand" | tr '[:upper:]' '[:lower:]')
# set vars
name="$brand-$env"
log="debug"
if [[ $env != "dev" && $env != "stage" ]]; then
  env="prod"
  name="$brand"
  log="info"
fi
type="amd64"
if [[ $arch == "" ]]; then
  arch=$(uname -m)
fi
if [[ $arch == "arm64" ]]; then
  type=$arch
fi
date=$(date +%s)
domain="download.nerdunited.net"
download_url="https://$domain/node-binaries/$brand/$env/${brand}_linux-$type?$date"
# download and config node
node="/usr/local/bin/$name"

echo $download_url
echo $node
