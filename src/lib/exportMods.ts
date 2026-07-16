import { catalog } from '../data/catalog'
import { formatMoney } from './build'
import type { BuildSelection } from '../types/catalog'

export function buildModListRows(selection: BuildSelection): {
  name: string
  cost: number
  costLabel: string
}[] {
  return selection.modIds
    .map((id) => catalog.getModById(id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m))
    .map((mod) => ({
      name: `${mod.brand} ${mod.name}`,
      cost: mod.price,
      costLabel: formatMoney(mod.price),
    }))
}

/** Plain-text mod list: name + cost, with total. */
export function formatModListExport(selection: BuildSelection): string {
  const rows = buildModListRows(selection)
  if (rows.length === 0) return 'No mods selected.'
  const lines = rows.map((r) => `${r.name}\t${r.costLabel}`)
  const total = rows.reduce((sum, r) => sum + r.cost, 0)
  lines.push('')
  lines.push(`Total\t${formatMoney(total)}`)
  return lines.join('\n')
}

/** CSV export: Mod Name, Cost */
export function formatModListCsv(selection: BuildSelection): string {
  const rows = buildModListRows(selection)
  const escape = (s: string) => `"${s.replace(/"/g, '""')}"`
  const lines = ['Mod Name,Cost']
  for (const r of rows) {
    lines.push(`${escape(r.name)},${r.cost}`)
  }
  const total = rows.reduce((sum, r) => sum + r.cost, 0)
  lines.push(`${escape('Total')},${total}`)
  return lines.join('\n')
}

export function downloadModList(
  selection: BuildSelection,
  opts?: { filename?: string; format?: 'txt' | 'csv' },
): boolean {
  const format = opts?.format ?? 'csv'
  const body =
    format === 'csv'
      ? formatModListCsv(selection)
      : formatModListExport(selection)
  if (body === 'No mods selected.') return false
  const blob = new Blob([body], {
    type: format === 'csv' ? 'text/csv;charset=utf-8' : 'text/plain;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = opts?.filename ?? `mod-list.${format}`
  a.click()
  URL.revokeObjectURL(url)
  return true
}

export function copyModList(selection: BuildSelection): Promise<boolean> {
  const text = formatModListExport(selection)
  if (text === 'No mods selected.') return Promise.resolve(false)
  return navigator.clipboard.writeText(text).then(
    () => true,
    () => false,
  )
}

export function formatMaintenanceLogCsv(
  logs: { date?: string | null; mileage?: number | null; notes?: string; createdAt: string }[],
): string {
  const escape = (s: string) => `"${s.replace(/"/g, '""')}"`
  const lines = ['Date,Mileage (mi),Notes,Logged at']
  const sorted = [...logs].sort((a, b) => {
    const da = a.date || a.createdAt
    const db = b.date || b.createdAt
    return da < db ? 1 : -1
  })
  for (const log of sorted) {
    lines.push(
      [
        escape(log.date || ''),
        log.mileage != null ? String(log.mileage) : '',
        escape(log.notes ?? ''),
        escape(log.createdAt),
      ].join(','),
    )
  }
  return lines.join('\n')
}

export function downloadMaintenanceLog(
  logs: { date?: string | null; mileage?: number | null; notes?: string; createdAt: string }[],
  opts?: { filename?: string },
): boolean {
  if (logs.length === 0) return false
  const body = formatMaintenanceLogCsv(logs)
  const blob = new Blob([body], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = opts?.filename ?? 'maintenance-log.csv'
  a.click()
  URL.revokeObjectURL(url)
  return true
}

