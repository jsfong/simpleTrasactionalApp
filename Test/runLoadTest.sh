#!/bin/bash

JMETER_PATH="D:\Dev\nodejs\apache-jmeter-5.4.1\bin\jmeter"
R_DIR="report"
echo $JMETER_PATH

rm log.jtl
rm -rf ${R_DIR}/*

echo "==== run jmeter ===="
$JMETER_PATH -n -t TransactionalServerTest.jmx -l log.jtl

echo "==== Generte Test Report ===="
$JMETER_PATH -g log.jtl -o ${R_DIR}

echo "==== HTML Test Report ===="
echo "See HTML test report in ${R_DIR}/index.html"