// Tính điểm theo meta.scoring trong JSON.
// - Điểm mỗi mục = points × hệ số trạng thái (pass 1 · warn 0,5 · fail 0).
// - Mục na loại khỏi điểm tối đa. Mục tự tick: đã tick = 1, chưa tick = 0.
// - Còn mục Bắt buộc ở trạng thái fail → xếp loại thấp nhất ("Chưa nên đăng").
import type { CheckResult, Checklist, ScoreSummary } from './types';

export function score(results: CheckResult[], checklist: Checklist, ticked: Set<number>): ScoreSummary {
  const sf = checklist.meta.scoring.status_factor;
  const byId = new Map(checklist.items.map((i) => [i.id, i]));
  let earned = 0;
  let max = 0;
  const counts = { pass: 0, warn: 0, fail: 0, manual: 0, na: 0 };
  const urgent: number[] = [];

  for (const r of results) {
    const item = byId.get(r.id);
    if (!item) continue;
    counts[r.status]++;
    if (r.status === 'na') continue;
    const factor =
      r.status === 'manual' ? (ticked.has(r.id) ? sf.manual_checked ?? 1 : sf.manual_unchecked ?? 0) : sf[r.status] ?? 0;
    earned += item.points * factor;
    max += item.points;
    if (r.status === 'fail' && item.priority === 'Bắt buộc') urgent.push(r.id);
  }

  const ratio = max ? earned / max : 0;
  const ratings = [...checklist.meta.scoring.rating].sort((a, b) => b.min - a.min);
  const lowest = ratings[ratings.length - 1].label;
  const blockedByMandatory = urgent.length > 0;
  const rating = blockedByMandatory ? lowest : (ratings.find((r) => ratio >= r.min) ?? ratings[ratings.length - 1]).label;
  return { earned, max, ratio, rating, blockedByMandatory, counts, urgent };
}
