import i18n from 'i18next';
import { en } from './en';
import { ptBr } from './pt-br';

export function loadUserTranslations() {
  i18n.addResourceBundle('en', 'user', en);
  i18n.addResourceBundle('pt-br', 'user', ptBr);
}