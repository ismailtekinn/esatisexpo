import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';  // react-native-localize yerine

import en from './locales/en.json';
import tr from './locales/tr.json';
import fa from './locales/fr.json';  // fr.json değil fa.json olduğundan emin ol

const deviceLanguage = Localization.locale.split('-')[0]; // örn: "tr-TR" -> "tr"

i18n
  .use(initReactI18next)
  .init({
    lng: deviceLanguage,
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      tr: { translation: tr },
      fa: { translation: fa },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
