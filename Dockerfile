FROM alpine

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY bin/hyper /usr/local/bin/
RUN chmod +x /usr/local/bin/hyper


COPY bin/run.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/run.sh

CMD /usr/local/bin/run.sh /usr/local/bin/hyper config ; /usr/local/bin/hyper