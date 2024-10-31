import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config:any, context: any) => {
    config.watchOptions = {
      poll: 1000, // ファイルの変更を1秒ごとに確認
      aggregateTimeout: 300 // 複数の変更をまとめて反映
    };
    return config;
  }
};

export default nextConfig;
