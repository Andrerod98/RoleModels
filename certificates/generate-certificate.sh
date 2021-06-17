#!/usr/bin/env bash
GREEN='\033[0;32m'
NC='\033[0m' # No Color
printf "${GREEN}Setting NODE_TLS_REJECT_UNAUTHORIZED to 0...${NC}\n"
export NODE_TLS_REJECT_UNAUTHORIZED='0'
printf "${GREEN}Generating certificates...${NC}\n"
openssl req -config openssl.cnf -new -x509 -days 825 -out host.crt
printf "${GREEN}The certificates were generated: host.crt and host.key${NC}\n"
