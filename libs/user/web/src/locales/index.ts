import { languages } from '@gym-app/shared/web';
import i18n from 'i18next';
import { en } from './en';
import { ptBr } from './pt-br';

export function loadUserTranslations() {
  i18n.addResourceBundle(languages.en, 'user', en, true, true);
  i18n.addResourceBundle(languages.ptBr, 'user', ptBr, true, true);
}