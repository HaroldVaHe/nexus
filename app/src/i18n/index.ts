import { en } from './translations/en';
import { es } from './translations/es';

type Language = 'en' | 'es';

const translationDict: Record<Language, typeof en> = { en, es };

export type { Language };
export { translationDict };
