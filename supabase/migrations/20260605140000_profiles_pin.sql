/**
 * Persönliche PIN pro Profil (Anzeige im Profil, später für Geräte-Kopplung).
 * 4-stellig, wird beim ersten Anzeigen generiert, falls leer.
 */
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pin text;
