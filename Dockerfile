# ベース
FROM node:23-alpine

# 作業ディレクトリを設定
WORKDIR /app

# パッケージファイルをコピーして依存関係をインストール
COPY package.json package-lock.json ./
RUN npm install

# Next.jsアプリのコードをコピー
COPY . .

# Prisma Clientをビルド
RUN npx prisma generate

# Next.jsアプリをビルド
RUN npm run build

# アプリを起動するポートを指定
EXPOSE 3000

# Next.jsアプリを起動
CMD ["npm", "start"]
