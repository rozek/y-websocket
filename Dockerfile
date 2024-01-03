FROM alpine:latest

RUN apk update \
 && apk add --update nodejs npm git \
 && mkdir /y-websocket \
 && cd /y-websocket \
 && npm i rozek/y-websocket

CMD ["/bin/ash","-c","cd /y-websocket && CERT=/cert/XXX HOST=0.0.0.0 PORT=1234 npx rozek/y-websocket"]
