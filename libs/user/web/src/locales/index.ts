import { languages } from '@gym-app/shared/web';
import i18n from 'i18next';

export async function loadUserTranslations() {
  const { en } = await import('./en');
  const { ptBr } = await import('./pt-br');
  i18n.addResourceBundle(languages.en, 'user', en, true, true);
  i18n.addResourceBundle(languages.ptBr, 'user', ptBr, true, true);
}

if (import.meta.hot) {
  import.meta.hot.accept('./en', async () => {
    console.error('@@## user translations');
    loadUserTranslations();
  });

  import.meta.hot.accept('./pt-br', async () => {
    console.error('@@## user translations');
    loadUserTranslations();
  });
  import.meta.hot.accept(['./en', './pt-br'], () => {
    console.error('@@## user translations');
    loadUserTranslations();
  });
  import.meta.hot.invalidate();
}
