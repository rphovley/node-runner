FROM alpine as builder

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY bin/hyper /usr/local/bin/
RUN chmod +x /usr/local/bin/hyper

FROM scratch

COPY --from=builder /usr/local/bin/hyper /root/hyper

CMD ["/root/hyper"]