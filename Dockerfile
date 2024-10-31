# ベース
FROM node:20

# 作業ディレクトリを設定
WORKDIR /app

# Install dependencies
COPY ./app/package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the app
# CMD ["npm", "run", "dev"]


# コンテナを開きっぱなしにする
CMD ["tail", "-f", "/dev/null"]
