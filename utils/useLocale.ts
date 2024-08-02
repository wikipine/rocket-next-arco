import { useContext } from 'react';
import { GlobalContext } from '@/common/context';
import defaultLocale from '@/config/locale';

function useLocale(locale = null) {
  const { lang } = useContext(GlobalContext);

  return (locale || defaultLocale)[lang] || {};
}

export default useLocale;
