import React, { useContext } from 'react';
import {
  Tooltip,
  Avatar,
  Select,
  Dropdown,
  Menu,
  Message,
} from '@arco-design/web-react';
import {
  IconLanguage,
  IconSunFill,
  IconMoonFill,
  IconPoweroff,
  IconUser,
} from '@arco-design/web-react/icon';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { GlobalContext } from '@/common/context';
import useLocale from '@/utils/useLocale';
import Logo from '@/assets/logo.svg';
import IconButton from './IconButton';
import styles from '@/components/layout/navbar/style/index.module.less';
import defaultLocale from '@/config/locale';
import { loginOut } from '@/utils/auth';

function Navbar({ show }: { show: boolean }) {
  const t = useLocale();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { setLang, lang, theme, setTheme } = useContext(GlobalContext);

  function onMenuItemClick(key) {
    if (key === 'logout') {
      loginOut();
    } else {
      Message.info(`You clicked ${key}`);
    }
  }

  if (!show) {
    return <div className={styles['fixed-settings']}></div>;
  }

  const droplist = (
    <Menu onClickMenuItem={onMenuItemClick}>
      <Menu.Item key="logout">
        <IconPoweroff className={styles['dropdown-icon']} />
        {t['navbar.logout']}
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <Logo />
          <div className={styles['logo-name']}>Arco Pro</div>
        </div>
      </div>
      <ul className={styles.right}>
        <li>
          <Select
            triggerElement={<IconButton icon={<IconLanguage />} />}
            options={[
              { label: '中文', value: 'zh-CN' },
              { label: 'English', value: 'en-US' },
            ]}
            value={lang}
            triggerProps={{
              autoAlignPopupWidth: false,
              autoAlignPopupMinWidth: true,
              position: 'br',
            }}
            trigger="hover"
            onChange={(value) => {
              setLang(value);
              const nextLang = defaultLocale[value];
              Message.info(`${nextLang['message.lang.tips']}${value}`);
            }}
          />
        </li>
        <li>
          <Tooltip
            content={
              theme === 'light'
                ? t['settings.navbar.theme.toDark']
                : t['settings.navbar.theme.toLight']
            }
          >
            <IconButton
              icon={theme !== 'dark' ? <IconMoonFill /> : <IconSunFill />}
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            />
          </Tooltip>
        </li>
        {userInfo && (
          <li>
            <Dropdown droplist={droplist} position="br">
              <Avatar size={32} style={{ cursor: 'pointer' }}>
                {userInfo.avatar ? (
                  <img alt="avatar" src={userInfo.avatar} />
                ) : (
                  <IconUser />
                )}
              </Avatar>
            </Dropdown>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
