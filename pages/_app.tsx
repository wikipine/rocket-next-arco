import React, { useEffect, useMemo } from 'react';
import cookies from 'next-cookies';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import '@/assets/style/global.less';
import { ConfigProvider } from '@arco-design/web-react';
import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import enUS from '@arco-design/web-react/es/locale/en-US';
import { GlobalContext } from '@/common/context';
import changeTheme from '@/utils/changeTheme';
import useStorage from '@/utils/useStorage';
import LayoutDefault from '@/components/layout/default';
import '@/api/mock';
import store from '@/store';
import useNProgress from '@/hooks/useNProgress';

interface RenderConfig {
  arcoLang?: string;
  arcoTheme?: string;
}

export default function MyApp({
  pageProps,
  Component,
  renderConfig,
}: AppProps & { renderConfig: RenderConfig }) {
  const { arcoLang, arcoTheme } = renderConfig;
  const [lang, setLang] = useStorage('arco-lang', arcoLang || 'en-US');
  const [theme, setTheme] = useStorage('arco-theme', arcoTheme || 'light');
  // 加入进度显示
  useNProgress();

  const locale = useMemo(() => {
    switch (lang) {
      case 'zh-CN':
        return zhCN;
      case 'en-US':
        return enUS;
      default:
        return enUS;
    }
  }, [lang]);

  useEffect(() => {
    document.cookie = `arco-lang=${lang}; path=/`;
    document.cookie = `arco-theme=${theme}; path=/`;
    changeTheme(theme);
  }, [lang, theme]);

  const contextValue = {
    lang,
    setLang,
    theme,
    setTheme,
  };

  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="https://unpkg.byted-static.com/latest/byted/arco-config/assets/favicon.ico"
        />
      </Head>
      <ConfigProvider
        locale={locale}
        componentConfig={{
          Card: {
            bordered: false,
          },
          List: {
            bordered: false,
          },
          Table: {
            border: false,
          },
        }}
      >
        <Provider store={store}>
          <GlobalContext.Provider value={contextValue}>
            {Component.displayName === 'LoginPage' ? (
              <Component {...pageProps} suppressHydrationWarning />
            ) : (
              <LayoutDefault>
                <Component {...pageProps} suppressHydrationWarning />
              </LayoutDefault>
            )}
          </GlobalContext.Provider>
        </Provider>
      </ConfigProvider>
    </>
  );
}

// fix: next build ssr can't attach the localstorage
MyApp.getInitialProps = async (appContext) => {
  const { ctx } = appContext;
  const serverCookies = cookies(ctx);
  return {
    renderConfig: {
      arcoLang: serverCookies['arco-lang'],
      arcoTheme: serverCookies['arco-theme'],
    },
  };
};
