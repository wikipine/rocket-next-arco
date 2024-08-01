/** @type {import('next').NextConfig} */
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// 加载配置文件 APP_ENV 环境名即后缀名
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const envFilePath = path.resolve(__dirname, 'env/.env.' + process.env.APP_ENV);
if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath });
}

const nextConfig = {};

export default nextConfig;
