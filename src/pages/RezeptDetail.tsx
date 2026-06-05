import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Clock, Star, Trash2, ExternalLink, ChefHat, Pencil, Save, X, Plus,
} from 'lucide-react';
import './RezeptDetail.css';
import { SchwierigkeitBadge } from '../components/SchwierigkeitBadge';
import { ZutatIcon } from '../components/ZutatIcon';
import { RecipeRating } from '../components/RecipeRating';
import { CookedButton } from '../components/CookedButton';
import { RecipeNotes } from '../components/RecipeNotes';
import { RecipeTypeSelector } from '../components/RecipeTypeSelector';
import { ImageSelectorModal } from '../components/ImageSelectorModal';
import { getRecipe, deleteRecipe, toggleFavorite, updateRecipe } from '../lib/recipes';
import { supabase } from '../lib/supabase';
import type { Recipe, Schwierigkeit, Zutat, RecipeType } from '../lib/types/recipe';
import { RECIPE_TYPE_LABELS } from '../lib/types/recipe';

export function RezeptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [workspaceId, setWorkspaceId] = useState<string>('');

  // Edit-Mode state
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Recipe | null>(null);
  const [saving, setSaving] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  // Load recipe + user/workspace info
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    // Get user + workspace
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && !cancelled) setUserId(user.id);

        const { data: profile } = await supabase
          .from('profiles')
          .select('workspace_id')
          .eq('id', user?.id ?? '')
          .single();

        if (profile && !cancelled) setWorkspaceId((profile as any).workspace_id);
      } catch (e) {
        console.error('Failed to load user info:', e);
      }
    })();

    // Get recipe
    getRecipe(id)
      .then(r => { if (!cancelled) setRecipe(r); })
      .catch(e => { if (!cancelled) setError(e instanceof Error ? e.message : 'Fehler beim Laden'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id]);

  const handleFav = async () => {
    if (!recipe) return;
    const next = !recipe.is_favorite;
    setRecipe({ ...recipe, is_favorite: next });
    try {
      await toggleFavorite(recipe.id, next);
    } catch (e) {
      setRecipe({ ...recipe, is_favorite: !next });
      setError(e instanceof Error ? e.message : 'Konnte nicht speichern.');
    }
  };

  const handleDelete = async () => {
    if (!recipe) return;
    if (!confirm(`Rezept „${recipe.titel}" wirklich löschen?`)) return;
    try {
      await deleteRecipe(recipe.id);
      navigate('/rezepte');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Konnte nicht löschen.');
    }
  };

  const startEdit = () => {
    if (!recipe) return;
    setDraft({ ...recipe, zutaten: [...recipe.zutaten], zubereitung: [...recipe.zubereitung] });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setDraft(null);
  };

  const saveEdit = async () => {
    if (!draft) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateRecipe(draft.id, {
        titel: draft.titel,
        beschreibung: draft.beschreibung,
        portionen: draft.portionen,
        zubereitungszeit_min: draft.zubereitungszeit_min,
        schwierigkeit: draft.schwierigkeit,
        kategorie: draft.kategorie,
        zutaten: draft.zutaten,
        zubereitung: draft.zubereitung,
        tags: draft.tags,
        bild_url: draft.bild_url,
      });
      setRecipe(updated);
      setEditing(false);
      setDraft(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Konnte nicht speichern.');
    } finally {
      setSaving(false);
    }
  };

  // Zutat-Editor-Helfer
  const patchZutat = (idx: number, patch: Partial<Zutat>) => {
    if (!draft) return;
    const next = [...draft.zutaten];
    next[idx] = { ...next[idx], ...patch };
    setDraft({ ...draft, zutaten: next });
  };
  const addZutat = () => {
    if (!draft) return;
    setDraft({ ...draft, zutaten: [...draft.zutaten, { name: '', menge: 1, einheit: 'Stk', hinweis: null }] });
  };
  const removeZutat = (idx: number) => {
    if (!draft) return;
    setDraft({ ...draft, zutaten: draft.zutaten.filter((_, i) => i !== idx) });
  };

  // Zubereitung-Editor-Helfer
  const patchStep = (idx: number, text: string) => {
    if (!draft) return;
    const next = [...draft.zubereitung];
    next[idx] = text;
    setDraft({ ...draft, zubereitung: next });
  };
  const addStep = () => {
    if (!draft) return;
    setDraft({ ...draft, zubereitung: [...draft.zubereitung, ''] });
  };
  const removeStep = (idx: number) => {
    if (!draft) return;
    setDraft({ ...draft, zubereitung: draft.zubereitung.filter((_, i) => i !== idx) });
  };

  if (loading) return <div className="rdet"><p className="rdet__loading">Lade…</p></div>;
  if (error && !recipe) return <div className="rdet"><div className="rdet__error">{error}</div></div>;
  if (!recipe) return (
    <div className="rdet">
      <p className="rdet__loading">Rezept nicht gefunden.</p>
      <Link to="/rezepte" className="rdet__back">← zurück zu Rezepten</Link>
    </div>
  );

  // Render-Quelle: draft im Edit-Mode, sonst recipe
  const r = editing && draft ? draft : recipe;

  // Speichern nur aktiv, wenn wirklich etwas geändert wurde
  const editableKeys = [
    'titel', 'beschreibung', 'portionen', 'zubereitungszeit_min', 'schwierigkeit',
    'kategorie', 'zutaten', 'zubereitung', 'tags', 'bild_url',
  ] as const;
  const isDirty = !!(editing && draft && recipe &&
    editableKeys.some(k => JSON.stringify((draft as any)[k]) !== JSON.stringify((recipe as any)[k])));

  return (
    <div className="rdet">
      <header className="rdet__header">
        <Link to="/rezepte" className="rdet__back">
          <ArrowLeft size={14} strokeWidth={2} /> zurück zu Rezepten
        </Link>

        <div className="rdet__hero">
          <div className="rdet__image-wrap">
            {r.bild_url ? (
              <img src={r.bild_url} alt={r.titel} className="rdet__image" />
            ) : (
              <div className="rdet__image rdet__image--placeholder"><ChefHat size={48} /></div>
            )}
            {/* View: Aktionen als Icons aufs Bild (oben rechts) */}
            {!editing && (
              <div className="rdet__img-actions">
                <button className="rdet__img-btn" onClick={startEdit} aria-label="Bearbeiten" title="Bearbeiten">
                  <Pencil size={15} strokeWidth={2} />
                </button>
                <button
                  className={`rdet__img-btn ${r.is_favorite ? 'is-active' : ''}`}
                  onClick={handleFav}
                  aria-label={r.is_favorite ? 'Aus Favoriten entfernen' : 'Als Favorit'}
                  title="Favorit"
                >
                  <Star size={15} fill={r.is_favorite ? 'currentColor' : 'none'} strokeWidth={2} />
                </button>
                {r.source_url && (
                  <a
                    className="rdet__img-btn"
                    href={r.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Quelle: ${r.source_author ?? r.source}`}
                    title={r.source_author ?? r.source}
                  >
                    <ExternalLink size={15} strokeWidth={2} />
                  </a>
                )}
              </div>
            )}
            {editing && draft && (
              <button
                type="button"
                className="rdet__image-change"
                onClick={() => setShowImagePicker(true)}
              >
                {r.bild_url ? 'Bild ändern' : 'Bild wählen'}
              </button>
            )}
          </div>
          {showImagePicker && draft && (
            <ImageSelectorModal
              recipeId={draft.id}
              recipeName={draft.titel}
              onClose={() => setShowImagePicker(false)}
              onSelect={(url) => {
                setDraft({ ...draft, bild_url: url });
                setShowImagePicker(false);
              }}
            />
          )}

          <div className="rdet__title-block">
            {editing && draft ? (
              <>
                <input
                  className="rdet__title-input"
                  value={draft.titel}
                  onChange={e => setDraft({ ...draft, titel: e.target.value })}
                  placeholder="Rezept-Titel"
                />
                <textarea
                  className="rdet__desc-input"
                  value={draft.beschreibung ?? ''}
                  onChange={e => setDraft({ ...draft, beschreibung: e.target.value || null })}
                  placeholder="Kurze Beschreibung (optional)"
                  rows={2}
                />
                <div className="rdet__meta-edit">
                  <label className="rdet__meta-field">
                    <span>Min</span>
                    <input
                      type="number"
                      min="0"
                      value={draft.zubereitungszeit_min ?? ''}
                      onChange={e => setDraft({ ...draft, zubereitungszeit_min: e.target.value ? parseInt(e.target.value) : null })}
                    />
                  </label>
                  <label className="rdet__meta-field">
                    <span>Portionen</span>
                    <input
                      type="number"
                      min="1"
                      value={draft.portionen}
                      onChange={e => setDraft({ ...draft, portionen: parseInt(e.target.value) || 1 })}
                    />
                  </label>
                  <label className="rdet__meta-field">
                    <span>Schwierigkeit</span>
                    <select
                      value={draft.schwierigkeit ?? ''}
                      onChange={e => setDraft({ ...draft, schwierigkeit: e.target.value ? (e.target.value as Schwierigkeit) : null })}
                    >
                      <option value="">—</option>
                      <option value="einfach">einfach</option>
                      <option value="mittel">mittel</option>
                      <option value="aufwendig">aufwendig</option>
                    </select>
                  </label>
                </div>
                {recipe && (
                  <div className="rdet__type-edit">
                    <RecipeTypeSelector recipeId={recipe.id} initialType={(recipe.recipe_type as any) || 'hauptgericht'} />
                  </div>
                )}
              </>
            ) : (
              <>
                <h1>{r.titel}</h1>
                {r.beschreibung && <p className="rdet__desc">{r.beschreibung}</p>}
                <div className="rdet__meta">
                  {r.zubereitungszeit_min != null && (
                    <span className="rdet__meta-item">
                      <Clock size={15} strokeWidth={2} /> {r.zubereitungszeit_min} Min
                    </span>
                  )}
                  {r.schwierigkeit && (
                    <SchwierigkeitBadge schwierigkeit={r.schwierigkeit as Schwierigkeit} size={15} />
                  )}
                  <span className="rdet__meta-item">{r.portionen} Port.</span>
                </div>
                {r.recipe_type && (
                  <span className="rdet__type-pill">{RECIPE_TYPE_LABELS[r.recipe_type as RecipeType] ?? r.recipe_type}</span>
                )}
              </>
            )}
          </div>

          {editing && (
            <div className="rdet__actions is-editing">
              <button className="rdet__cancel" onClick={cancelEdit} aria-label="Abbrechen">
                <X size={16} />
              </button>
              <button className="rdet__save" onClick={saveEdit} disabled={saving || !isDirty} aria-label="Speichern">
                <Save size={16} strokeWidth={2} /> {saving ? 'Speichere…' : 'Speichern'}
              </button>
            </div>
          )}
        </div>
      </header>

      {error && <div className="rdet__error">{error}</div>}

      {/* Quick-Panel: Gekocht + Rating + Typ — oben, in der ersten Kachel-Reihe */}
      {!editing && recipe && userId && workspaceId && (
        <section className="rdet__quick">
          <div className="rdet__quick-top">
            <CookedButton recipeId={recipe.id} workspaceId={workspaceId} userId={userId} />
            <RecipeRating recipeId={recipe.id} workspaceId={workspaceId} userId={userId} />
          </div>
        </section>
      )}

      <main className={`rdet__main ${editing ? 'is-editing' : ''}`}>
        <section className="rdet__zutaten">
          <h2>Zutaten</h2>
          {editing && draft ? (
            <ul className="rdet__zutaten-edit">
              {draft.zutaten.map((z, i) => (
                <li key={i} className="rdet__zutat-row">
                  <ZutatIcon name={z.name} size={20} />
                  <input
                    className="rdet__zutat-name-input"
                    placeholder="Name"
                    value={z.name}
                    onChange={e => patchZutat(i, { name: e.target.value })}
                  />
                  <input
                    className="rdet__zutat-menge-input"
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="Menge"
                    value={z.menge ?? ''}
                    onChange={e => patchZutat(i, { menge: e.target.value ? parseFloat(e.target.value) : null })}
                  />
                  <input
                    className="rdet__zutat-einheit-input"
                    placeholder="Einheit"
                    value={z.einheit}
                    onChange={e => patchZutat(i, { einheit: e.target.value })}
                  />
                  <button className="rdet__row-del" onClick={() => removeZutat(i)} aria-label="Zutat entfernen">
                    <Trash2 size={13} />
                  </button>
                </li>
              ))}
              <li>
                <button className="rdet__add-row" onClick={addZutat}>
                  <Plus size={14} strokeWidth={2} /> Zutat
                </button>
              </li>
            </ul>
          ) : (
            <ul>
              {r.zutaten.map((z, i) => (
                <li key={i}>
                  <ZutatIcon name={z.name} size={18} />
                  <span className="rdet__menge">
                    {z.menge != null ? `${z.menge}` : ''}
                    {z.einheit && ` ${z.einheit}`}
                  </span>
                  <span className="rdet__name">{z.name}</span>
                  {z.hinweis && <em>{z.hinweis}</em>}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rdet__zubereitung">
          <h2>Zubereitung</h2>
          {editing && draft ? (
            <ol className="rdet__steps-edit">
              {draft.zubereitung.map((s, i) => (
                <li key={i} className="rdet__step-row">
                  <span className="rdet__step-num">{i + 1}</span>
                  <textarea
                    rows={2}
                    value={s}
                    onChange={e => patchStep(i, e.target.value)}
                    placeholder="Schritt-Beschreibung"
                  />
                  <button className="rdet__row-del" onClick={() => removeStep(i)} aria-label="Schritt entfernen">
                    <Trash2 size={13} />
                  </button>
                </li>
              ))}
              <li>
                <button className="rdet__add-row" onClick={addStep}>
                  <Plus size={14} strokeWidth={2} /> Schritt
                </button>
              </li>
            </ol>
          ) : (
            <ol>
              {r.zubereitung.map((s, i) => (
                <li key={i}><span className="rdet__step-num">{i + 1}</span><p>{s}</p></li>
              ))}
            </ol>
          )}
        </section>
      </main>

      {/* Koch-Tracking als eigener Block unter dem Rezept (nicht im Edit) */}
      {!editing && recipe && userId && workspaceId && (
        <div className="rdet__panel rdet__notes"><RecipeNotes recipeId={recipe.id} workspaceId={workspaceId} /></div>
      )}

      {/* Löschen ganz unten, dezent */}
      {!editing && recipe && (
        <button className="rdet__delete-bottom" onClick={handleDelete}>
          <Trash2 size={15} strokeWidth={1.75} /> Rezept löschen
        </button>
      )}
    </div>
  );
}
