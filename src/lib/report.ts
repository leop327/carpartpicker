/**
 * Lightweight “report incorrect info” — opens mailto / GitHub issue. No backend.
 */

export type ReportTarget =
  | { kind: 'mod'; modId: string; label: string }
  | { kind: 'car'; carId: string; label: string }
  | { kind: 'other'; label: string }

const GITHUB_ISSUES =
  'https://github.com/leop327/carpartpicker/issues/new'
const REPORT_EMAIL = 'hello@carpartpicker.app'

export function buildReportSubject(target: ReportTarget): string {
  return `[Report] ${target.kind}: ${target.label}`
}

export function buildReportBody(
  target: ReportTarget,
  details: string,
): string {
  const lines = [
    `Kind: ${target.kind}`,
    'label' in target ? `Label: ${target.label}` : '',
    target.kind === 'mod' ? `Mod ID: ${target.modId}` : '',
    target.kind === 'car' ? `Car ID: ${target.carId}` : '',
    '',
    'Details:',
    details.trim() || '(none)',
    '',
    `Page: ${typeof window !== 'undefined' ? window.location.href : ''}`,
  ]
  return lines.filter(Boolean).join('\n')
}

export function reportMailtoUrl(target: ReportTarget, details: string): string {
  const subject = encodeURIComponent(buildReportSubject(target))
  const body = encodeURIComponent(buildReportBody(target, details))
  return `mailto:${REPORT_EMAIL}?subject=${subject}&body=${body}`
}

export function reportGithubUrl(target: ReportTarget, details: string): string {
  const title = encodeURIComponent(buildReportSubject(target))
  const body = encodeURIComponent(buildReportBody(target, details))
  return `${GITHUB_ISSUES}?title=${title}&body=${body}`
}
