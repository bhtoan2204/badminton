FROM node:20.10.0-alpine 

RUN npm install peer -g

EXPOSE 9000

CMD ["peerjs", "--port", "9000", "--path", "/peerjs", "--key", "famfund"]
