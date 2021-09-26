FROM openjdk:8

RUN wget https://dlcdn.apache.org//jmeter/binaries/apache-jmeter-5.4.1.tgz
RUN tar -xvzf apache-jmeter-5.4.1.tgz
RUN rm apache-jmeter-5.4.1.tgz

RUN mv apache-jmeter-5.4.1 /jmeter

ENV JMETER_HOME /jmeter

WORKDIR /usr/src/app

# Add Jmeter to the path
ENV PATH="${JMETER_HOME}/bin:${PATH}"