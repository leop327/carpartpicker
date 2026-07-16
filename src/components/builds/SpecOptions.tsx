import type { SpecOptionGroup } from '../../types/catalog'
import { getDefaultSpecChoice } from '../../lib/build'
import './SpecOptions.css'

interface Props {
  groups: SpecOptionGroup[]
  selected: Record<string, string>
  onChange: (groupId: string, choiceId: string) => void
}

export function SpecOptions({ groups, selected, onChange }: Props) {
  if (groups.length === 0) return null

  return (
    <section className="spec-options" aria-label="Factory option groups">
      <div className="spec-options__intro">
        <p>
          Optional packs stay on the base choice until you pick something else —
          so you can configure the car exactly as it left the factory.
        </p>
      </div>

      <div className="spec-options__groups">
        {groups.map((group) => {
          const activeId =
            selected[group.id] ?? getDefaultSpecChoice(group).id
          return (
            <fieldset key={group.id} className="spec-group">
              <legend>{group.name}</legend>
              {group.description && (
                <p className="spec-group__desc">{group.description}</p>
              )}
              <div className="spec-group__choices">
                {group.choices.map((choice) => {
                  const isActive = choice.id === activeId
                  return (
                    <label
                      key={choice.id}
                      className={
                        isActive
                          ? 'spec-choice spec-choice--active'
                          : 'spec-choice'
                      }
                    >
                      <input
                        type="radio"
                        name={group.id}
                        value={choice.id}
                        checked={isActive}
                        onChange={() => onChange(group.id, choice.id)}
                      />
                      <span className="spec-choice__body">
                        <span className="spec-choice__name">
                          {choice.name}
                          {choice.isDefault && (
                            <span className="spec-choice__base">base</span>
                          )}
                        </span>
                        {choice.description && (
                          <span className="spec-choice__desc">
                            {choice.description}
                          </span>
                        )}
                      </span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          )
        })}
      </div>
    </section>
  )
}
