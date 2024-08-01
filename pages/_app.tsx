import React from "react";
import type { AppProps } from "next/app";
import { ConfigProvider } from "@arco-design/web-react";
import "@arco-design/web-react/dist/css/arco.css";
import "@/assets/css/globals.css";

interface RenderConfig {
  arcoLang?: string;
  arcoTheme?: string;
}

export default function MyApp({
  pageProps,
  Component,
  renderConfig,
}: AppProps & { renderConfig: RenderConfig }) {
  return (
    <>
      <ConfigProvider>
        <Component {...pageProps} />
      </ConfigProvider>
    </>
  );
}
