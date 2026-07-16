import { formatMoney } from './build'
import type { Figures } from '../types/catalog'

export interface ShareCardInput {
  title: string
  subtitle: string
  figures: Figures
  modsTotal: number
  levelLabel: string
  accelLabel?: string
}

/** Draw a shareable PNG summary card (no backend). */
export async function renderShareCard(
  input: ShareCardInput,
): Promise<Blob | null> {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 630
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const grad = ctx.createLinearGradient(0, 0, 1200, 630)
  grad.addColorStop(0, '#12151c')
  grad.addColorStop(1, '#1c222e')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1200, 630)

  ctx.fillStyle = '#ea580c'
  ctx.fillRect(0, 0, 16, 630)

  ctx.fillStyle = '#9aa3b2'
  ctx.font = '700 28px Manrope, sans-serif'
  ctx.fillText('CarPartPicker', 72, 88)

  ctx.fillStyle = '#eef1f6'
  ctx.font = '800 64px Space Grotesk, sans-serif'
  wrapText(ctx, input.title, 72, 180, 1050, 72)

  ctx.fillStyle = '#9aa3b2'
  ctx.font = '500 32px Manrope, sans-serif'
  ctx.fillText(input.subtitle, 72, 270)

  const accel = input.accelLabel ?? '0–62'
  const stats = [
    `${input.figures.hp} hp`,
    `${input.figures.torqueNm} Nm`,
    `${input.figures.zeroToSixtySec.toFixed(2)}s ${accel}`,
    formatMoney(input.modsTotal),
  ]
  ctx.fillStyle = '#eef1f6'
  ctx.font = '700 40px Space Grotesk, sans-serif'
  ctx.fillText(stats.join('   ·   '), 72, 400)

  ctx.fillStyle = '#ea580c'
  ctx.font = '700 28px Manrope, sans-serif'
  ctx.fillText(input.levelLabel.toUpperCase(), 72, 480)

  ctx.fillStyle = '#667085'
  ctx.font = '500 24px Manrope, sans-serif'
  ctx.fillText('UK figures · mods only', 72, 560)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png')
  })
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(' ')
  let line = ''
  let yy = y
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy)
      line = word
      yy += lineHeight
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, yy)
}
