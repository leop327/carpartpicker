import type { Colour } from '../../types/catalog'
import './ColourSwatches.css'

interface Props {
  colours: Colour[]
  selectedId: string | null
  onSelect: (colourId: string) => void
}

export function ColourSwatches({ colours, selectedId, onSelect }: Props) {
  const selected = colours.find((c) => c.id === selectedId)

  return (
    <div className="colour-picker">
      <div className="colour-picker__swatches" role="list">
        {colours.map((c) => (
          <button
            key={c.id}
            type="button"
            role="listitem"
            className={
              c.id === selectedId ? 'swatch swatch--active' : 'swatch'
            }
            style={{ background: c.hex }}
            aria-label={c.name}
            aria-pressed={c.id === selectedId}
            data-tooltip={c.name}
            onClick={() => onSelect(c.id)}
          />
        ))}
      </div>
      <p className="colour-picker__name">
        {selected?.name ?? 'Pick a colour to continue'}
      </p>
    </div>
  )
}
