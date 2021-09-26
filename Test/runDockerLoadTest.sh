#!/bin/bash

R_DIR="report"
rm log.jtl
rm -rf ${R_DIR}/*

echo "============="
eval "docker exec -it jmeter bash -c 'jmeter -v'"

echo "==== run jmeter ===="
eval "docker exec -it jmeter bash -c 'jmeter -n -t TransactionalServerDockerTest.jmx -l log.jtl'"

echo "==== Generte Test Report ===="
eval "docker exec -it jmeter bash -c 'jmeter -g log.jtl -o ${R_DIR}'"

echo "==== HTML Test Report ===="
echo "See HTML test report in ${R_DIR}/index.html"