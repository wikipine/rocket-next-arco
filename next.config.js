/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const withLess = require('next-with-less');
const withTM = require('next-transpile-modules')([
  '@arco-design/web-react',
  '@arco-themes/react-arco-pro',
]);

// 加载配置文件 APP_ENV 环境名即后缀名
const envFilePath = path.resolve(__dirname, 'env/.env.' + process.env.APP_ENV);
if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath });
}

const setting = require('./config/settings.json');

module.exports = withLess(
  withTM({
    lessLoaderOptions: {
      lessOptions: {
        modifyVars: {
          'arcoblue-6': setting.themeColor,
        },
      },
    },
    webpack: (config) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });

      config.resolve.alias['@/assets'] = path.resolve(__dirname, './assets');
      config.resolve.alias['@'] = path.resolve(__dirname, './');

      return config;
    },
    pageExtensions: ['tsx'],
  })
);
