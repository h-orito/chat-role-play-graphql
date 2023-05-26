FROM golang:1.20

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY ./* /go/src/chat-role-play/

# oracle cloud infrastructure用
ENV CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=arm64

RUN go build -o /main

EXPOSE 8080

CMD ["/main"]