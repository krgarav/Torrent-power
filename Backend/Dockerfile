# Use an Ubuntu-based Node.js image
FROM node:20-bullseye

# Install only poppler-utils
RUN apt-get update && apt-get install -y \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "server.js"]