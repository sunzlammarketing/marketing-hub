// Điểm vào của module kiểm tra SEO on-page. Dùng: analyze() → score().
import data from '../../data/seo-checklist-30.json';
import type { Checklist } from './types';

export const CHECKLIST = data as unknown as Checklist;
export { analyze } from './rules';
export { score } from './score';
export { sanitizeHtml, textToHtml } from './sanitize';
export * from './types';
