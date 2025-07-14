import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@/config/lang';
import { ExcelEmulatorScreen } from '@/components/ExcelEmulator/ExcelEmulatorScreen';
import { FireworksContextProvider } from '@/contexts/FireworksContext';
import { ProgressContextProvider } from '@/contexts/ProgressContext';
import { SelectionContextProvider } from '@/contexts/SelectionContext';

export function ExcelEmulatorPage() {
  const { t } = useTranslation();
  const lng = useLanguage();
  const title = t('app-title');
  const description = t('app-description');
  const ogImage = '/opengraph-image-new.jpg';
  return (
    <>
      <Helmet htmlAttributes={{ lang: lng }}>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content={title} />
        <meta property="og:locale" content={lng} />
        <meta property="og:type" content="website" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      <FireworksContextProvider>
        <ProgressContextProvider>
          <SelectionContextProvider>
            {/* Nested components */}
            <ExcelEmulatorScreen />
          </SelectionContextProvider>
        </ProgressContextProvider>
      </FireworksContextProvider>
    </>
  );
}
