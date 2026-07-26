-- CarPartPicker — logical parts schema (reference)
-- Live catalogue is TypeScript (`src/types/catalog.ts` + `src/data/mods/*`).
-- This SQL mirrors Mod fields for future Postgres / Supabase backends.

CREATE TABLE IF NOT EXISTS parts (
  id                TEXT PRIMARY KEY,
  name              TEXT NOT NULL,
  brand             TEXT NOT NULL,
  category          TEXT NOT NULL,
  price_gbp         NUMERIC(10, 2) NOT NULL,
  description       TEXT NOT NULL,
  claim             TEXT,
  hp_gain           INTEGER NOT NULL DEFAULT 0,
  torque_nm_gain    INTEGER,
  figures_source    TEXT CHECK (figures_source IN ('oem', 'estimated', 'tuner')),
  uk_mot_status     TEXT CHECK (
                      uk_mot_status IN (
                        'MOT Compliant',
                        'OPF Bypass Required',
                        'Track / Off-Road Only'
                      )
                    ),
  prerequisite_sku  TEXT,
  compatible_tags   TEXT[] NOT NULL DEFAULT '{}',
  conflict_group    TEXT,
  product_url       TEXT,
  audio_revs_url    TEXT,
  audio_flyby_url   TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS parts_category_idx ON parts (category);
CREATE INDEX IF NOT EXISTS parts_brand_idx ON parts (brand);
CREATE INDEX IF NOT EXISTS parts_uk_mot_status_idx ON parts (uk_mot_status);
