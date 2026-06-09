import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Clock, ChefHat, Users, Star, Trash2, ExternalLink, Pencil, Save, X, Plus,
  Bookmark, UtensilsCrossed,
} from 'lucide-react';
import './RezeptDetail.css';
import { ZutatIcon } from '../components/ZutatIcon';
import { RecipeNotes } from '../components/RecipeNotes';
import { ImageSelectorModal } from '../components/ImageSelectorModal';
import { getRecipe, deleteRecipe, toggleFavorite, updateRecipe, listRecipes } from '../lib/recipes';
import { supabase } from '../lib/supabase';
import type { Recipe, Schwierigkeit, Zutat } from '../lib/types/recipe';

export function RezeptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState('');
  const [workspaceId, setWorkspaceId] = useState('');

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Recipe | null>(null);
  const [saving, setSaving] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  // Gekocht + Rating (Kochlöffel-Sheet)
  const [myStars, setMyStars] = useState(0);
  const [myNote, setMyNote] = useState('');
  const [showCook, setShowCook] = useState(false);
  const [cookSaving, setCookSaving] = useState(false);

  // Tags-Editor
  const [tagInput, setTagInput] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && !cancelled) setUserId(user.id);
        const { data: profile } = await supabase.from('profiles').select('workspace_id').eq('id', user?.id ?? '').single();
        if (profile && !cancelled) setWorkspaceId((profile as any).workspace_id);
      } catch { /* ignore */ }
    })();
    getRecipe(id)
      .then(r => { if (!cancelled) setRecipe(r); })
      .catch(e => { if (!cancelled) setError(e instanceof Error ? e.message : 'Fehler beim Laden'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  // Eigene Bewertung laden (für Sterne-Badge)
  useEffect(() => {
    if (!id || !userId || !workspaceId) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from('recipe_ratings')
        .select('stars, notes').eq('recipe_id', id).eq('workspace_id', workspaceId).eq('user_id', userId).maybeSingle();
      if (!cancelled && data) { setMyStars((data as any).stars ?? 0); setMyNote((data as any).notes ?? ''); }
    })();
    return () => { cancelled = true; };
  }, [id, userId, workspaceId]);

  const handleFav = async () => {
    if (!recipe) return;
    const next = !recipe.is_favorite;
    setRecipe({ ...recipe, is_favorite: next });
    try { await toggleFavorite(recipe.id, next); }
    catch (e) { setRecipe({ ...recipe, is_favorite: !next }); setError(e instanceof Error ? e.message : 'Fehler.'); }
  };

  const handleDelete = async () => {
    if (!recipe) return;
    if (!confirm(`Rezept „${recipe.titel}" wirklich löschen?`)) return;
    try { await deleteRecipe(recipe.id); navigate('/rezepte'); }
    catch (e) { setError(e instanceof Error ? e.message : 'Konnte nicht löschen.'); }
  };

  const saveCooked = async () => {
    if (!recipe || !userId || !workspaceId) return;
    setCookSaving(true);
    try {
      await supabase.from('recipe_history').insert({
        workspace_id: workspaceId, recipe_id: recipe.id, user_id: userId, cooked_at: new Date().toISOString(),
      });
      if (myStars > 0) {
        await supabase.from('recipe_ratings').upsert({
          workspace_id: workspaceId, recipe_id: recipe.id, user_id: userId, stars: myStars, notes: myNote || null,
        }, { onConflict: 'workspace_id,recipe_id,user_id' });
      }
      setShowCook(false);
    } catch (e) { setError(e instanceof Error ? e.message : 'Konnte nicht speichern.'); }
    finally { setCookSaving(false); }
  };

  const startEdit = () => {
    if (!recipe) return;
    setDraft({ ...recipe, zutaten: [...recipe.zutaten], zubereitung: [...recipe.zubereitung] });
    setEditing(true);
    // Alle bisher genutzten Tags laden (nach Häufigkeit sortiert)
    listRecipes().then(rs => {
      const freq = new Map<string, number>();
      for (const r of rs) for (const t of r.tags) freq.set(t, (freq.get(t) ?? 0) + 1);
      setAllTags([...freq.entries()].sort((a, b) => b[1] - a[1]).map(e => e[0]));
    }).catch(() => {});
  };

  const addTag = (t: string) => {
    const tag = t.trim().toLowerCase();
    if (!draft || !tag || draft.tags.includes(tag)) return;
    setDraft({ ...draft, tags: [...draft.tags, tag] });
    setTagInput('');
  };
  const removeTag = (t: string) => draft && setDraft({ ...draft, tags: draft.tags.filter(x => x !== t) });
  const cancelEdit = () => { setEditing(false); setDraft(null); };
  const saveEdit = async () => {
    if (!draft) return;
    setSaving(true); setError(null);
    try {
      const updated = await updateRecipe(draft.id, {
        titel: draft.titel, beschreibung: draft.beschreibung, portionen: draft.portionen,
        zubereitungszeit_min: draft.zubereitungszeit_min, schwierigkeit: draft.schwierigkeit,
        kategorie: draft.kategorie, zutaten: draft.zutaten, zubereitung: draft.zubereitung,
        tags: draft.tags, bild_url: draft.bild_url,
      });
      setRecipe(updated); setEditing(false); setDraft(null);
    } catch (e) { setError(e instanceof Error ? e.message : 'Konnte nicht speichern.'); }
    finally { setSaving(false); }
  };

  const patchZutat = (idx: number, patch: Partial<Zutat>) => {
    if (!draft) return;
    const next = [...draft.zutaten]; next[idx] = { ...next[idx], ...patch };
    setDraft({ ...draft, zutaten: next });
  };
  const addZutat = () => draft && setDraft({ ...draft, zutaten: [...draft.zutaten, { name: '', menge: 1, einheit: 'Stk', hinweis: null }] });
  const removeZutat = (idx: number) => draft && setDraft({ ...draft, zutaten: draft.zutaten.filter((_, i) => i !== idx) });
  const patchStep = (idx: number, text: string) => {
    if (!draft) return;
    const next = [...draft.zubereitung]; next[idx] = text;
    setDraft({ ...draft, zubereitung: next });
  };
  const addStep = () => draft && setDraft({ ...draft, zubereitung: [...draft.zubereitung, ''] });
  const removeStep = (idx: number) => draft && setDraft({ ...draft, zubereitung: draft.zubereitung.filter((_, i) => i !== idx) });

  if (loading) return <div className="rdet"><p className="rdet__loading">Lade…</p></div>;
  if (!recipe) return (
    <div className="rdet"><p className="rdet__loading">Rezept nicht gefunden.</p>
      <Link to="/rezepte" className="rdet__back">← zurück zu Rezepten</Link></div>
  );

  const r = editing && draft ? draft : recipe;
  const editableKeys = ['titel','beschreibung','portionen','zubereitungszeit_min','schwierigkeit','kategorie','zutaten','zubereitung','tags','bild_url'] as const;
  const isDirty = !!(editing && draft && editableKeys.some(k => JSON.stringify((draft as any)[k]) !== JSON.stringify((recipe as any)[k])));

  return (
    <div className="rdet">
      {/* ===== Banner-Hero ===== */}
      <div className="rdet__banner">
        {r.bild_url
          ? <img src={r.bild_url} alt={r.titel} className="rdet__banner-img" />
          : <div className="rdet__banner-img rdet__banner-img--ph"><ChefHat size={56} /></div>}

        <Link to="/rezepte" className="rdet__banner-back"><ArrowLeft size={16} strokeWidth={2} /> zurück</Link>

        {!editing && (
          <div className="rdet__banner-actions">
            <button className="rdet__ib" onClick={startEdit} aria-label="Bearbeiten" title="Bearbeiten"><Pencil size={16} strokeWidth={2} /></button>
            <button className="rdet__ib" onClick={() => setShowCook(true)} aria-label="Gekocht & bewerten" title="Gekocht & bewerten"><UtensilsCrossed size={16} strokeWidth={2} /></button>
            <button className={`rdet__ib ${recipe.is_favorite ? 'is-active' : ''}`} onClick={handleFav} aria-label="Favorit" title="Favorit">
              <Bookmark size={16} strokeWidth={2} fill={recipe.is_favorite ? 'currentColor' : 'none'} />
            </button>
            {r.source_url && (
              <a className="rdet__ib" href={r.source_url} target="_blank" rel="noopener noreferrer" aria-label="Quelle" title={r.source_author ?? r.source}><ExternalLink size={16} strokeWidth={2} /></a>
            )}
          </div>
        )}

        {editing && draft && (
          <button className="rdet__banner-change" onClick={() => setShowImagePicker(true)}>
            {r.bild_url ? 'Bild ändern' : 'Bild wählen'}
          </button>
        )}

        {!editing && myStars > 0 && (
          <div className="rdet__banner-rating">{'★'.repeat(myStars)}<span className="rdet__banner-rating-e">{'★'.repeat(5 - myStars)}</span></div>
        )}
      </div>

      {showImagePicker && draft && (
        <ImageSelectorModal recipeId={draft.id} recipeName={draft.titel}
          onClose={() => setShowImagePicker(false)}
          onSelect={(url) => { setDraft({ ...draft, bild_url: url }); setShowImagePicker(false); }} />
      )}

      {error && <div className="rdet__error">{error}</div>}

      <div className="rdet__body">
        {/* ===== Titel / Meta ===== */}
        {editing && draft ? (
          <div className="rdet__edit-head">
            <input className="rdet__title-input" value={draft.titel} onChange={e => setDraft({ ...draft, titel: e.target.value })} placeholder="Rezept-Titel" />
            <textarea className="rdet__desc-input" value={draft.beschreibung ?? ''} onChange={e => setDraft({ ...draft, beschreibung: e.target.value || null })} placeholder="Kurze Beschreibung (optional)" rows={2} />
            <div className="rdet__meta-edit">
              <label className="rdet__meta-field"><span>Min</span>
                <input type="number" min="0" value={draft.zubereitungszeit_min ?? ''} onChange={e => setDraft({ ...draft, zubereitungszeit_min: e.target.value ? parseInt(e.target.value) : null })} /></label>
              <label className="rdet__meta-field"><span>Portionen</span>
                <input type="number" min="1" value={draft.portionen} onChange={e => setDraft({ ...draft, portionen: parseInt(e.target.value) || 1 })} /></label>
              <label className="rdet__meta-field"><span>Schwierigkeit</span>
                <select value={draft.schwierigkeit ?? ''} onChange={e => setDraft({ ...draft, schwierigkeit: e.target.value ? (e.target.value as Schwierigkeit) : null })}>
                  <option value="">—</option><option value="einfach">einfach</option><option value="mittel">mittel</option><option value="aufwendig">aufwendig</option>
                </select></label>
            </div>
            <div className="rdet__tags-edit">
              <span className="rdet__edit-lbl">Tags</span>
              <div className="rdet__tags-active">
                {draft.tags.map(t => (
                  <button key={t} className="rdet__tag" onClick={() => removeTag(t)}>{t} <X size={12} strokeWidth={2.5} /></button>
                ))}
                <input
                  className="rdet__tag-input"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); } }}
                  placeholder="+ Tag"
                />
              </div>
              {(() => {
                const avail = allTags.filter(t => !draft.tags.includes(t));
                if (avail.length === 0) return null;
                const shown = showAllTags ? avail : avail.slice(0, 6);
                return (
                  <div className="rdet__tag-suggest">
                    {shown.map(t => <button key={t} className="rdet__tag-sug" onClick={() => addTag(t)}>{t}</button>)}
                    {avail.length > 6 && (
                      <button className="rdet__tag-more" onClick={() => setShowAllTags(v => !v)}>{showAllTags ? 'weniger' : `alle (${avail.length})`}</button>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        ) : (
          <div className="rdet__head">
            <h1>{r.titel}</h1>
            {r.beschreibung && <p className="rdet__desc">{r.beschreibung}</p>}
            <div className="rdet__meta">
              <span className="rdet__meta-item"><Clock size={16} strokeWidth={2} /> {r.zubereitungszeit_min != null ? `${r.zubereitungszeit_min} Min` : '—'}</span>
              <span className="rdet__meta-dot">·</span>
              <span className="rdet__meta-item"><ChefHat size={16} strokeWidth={2} /> {r.schwierigkeit ?? '—'}</span>
              <span className="rdet__meta-dot">·</span>
              <span className="rdet__meta-item"><Users size={16} strokeWidth={2} /> {r.portionen} Port.</span>
            </div>
            {r.tags.length > 0 && (
              <div className="rdet__tags-view">
                {r.tags.map(t => <span key={t} className="rdet__type-pill">{t}</span>)}
              </div>
            )}
          </div>
        )}

        {/* ===== Zutaten | Zubereitung ===== */}
        <main className={`rdet__main ${editing ? 'is-editing' : ''}`}>
          <section className="rdet__zutaten">
            <h2>Zutaten</h2>
            {editing && draft ? (
              <ul className="rdet__zutaten-edit">
                {draft.zutaten.map((z, i) => (
                  <li key={i} className="rdet__zutat-row">
                    <input className="rdet__zutat-name-input" placeholder="Zutat" value={z.name} onChange={e => patchZutat(i, { name: e.target.value })} />
                    <input className="rdet__zutat-menge-input" type="number" step="0.5" min="0" placeholder="Menge" value={z.menge ?? ''} onChange={e => patchZutat(i, { menge: e.target.value ? parseFloat(e.target.value) : null })} />
                    <input className="rdet__zutat-einheit-input" placeholder="g" value={z.einheit} onChange={e => patchZutat(i, { einheit: e.target.value })} />
                    <button className="rdet__row-del" onClick={() => removeZutat(i)} aria-label="Zutat entfernen"><Trash2 size={14} /></button>
                  </li>
                ))}
                <li><button className="rdet__add-row" onClick={addZutat}><Plus size={14} strokeWidth={2} /> Zutat</button></li>
              </ul>
            ) : (
              <ul>
                {r.zutaten.map((z, i) => (
                  <li key={i}>
                    <ZutatIcon name={z.name} size={18} />
                    <span className="rdet__menge">{z.menge != null ? `${z.menge}` : ''}{z.einheit && ` ${z.einheit}`}</span>
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
                    <textarea rows={2} value={s} onChange={e => patchStep(i, e.target.value)} placeholder="Schritt-Beschreibung" />
                    <button className="rdet__row-del" onClick={() => removeStep(i)} aria-label="Schritt entfernen"><Trash2 size={13} /></button>
                  </li>
                ))}
                <li><button className="rdet__add-row" onClick={addStep}><Plus size={14} strokeWidth={2} /> Schritt</button></li>
              </ol>
            ) : (
              <ol>{r.zubereitung.map((s, i) => (<li key={i}><span className="rdet__step-num">{i + 1}</span><p>{s}</p></li>))}</ol>
            )}
          </section>
        </main>

        {/* Edit: Speichern/Abbrechen unten */}
        {editing && (
          <div className="rdet__edit-actions">
            <button className="rdet__cancel" onClick={cancelEdit}><X size={16} /> Abbrechen</button>
            <button className="rdet__save" onClick={saveEdit} disabled={saving || !isDirty}><Save size={16} strokeWidth={2} /> {saving ? 'Speichere…' : 'Speichern'}</button>
          </div>
        )}

        {/* ===== Notizen + Löschen ===== */}
        {!editing && recipe && userId && workspaceId && (
          <div className="rdet__panel rdet__notes"><RecipeNotes recipeId={recipe.id} workspaceId={workspaceId} /></div>
        )}
        {!editing && (
          <button className="rdet__delete-bottom" onClick={handleDelete}><Trash2 size={15} strokeWidth={1.75} /> Rezept löschen</button>
        )}
      </div>

      {/* ===== Kochlöffel-Sheet: Gekocht + Bewerten ===== */}
      {showCook && (
        <>
          <div className="rdet__sheet-backdrop" onClick={() => !cookSaving && setShowCook(false)} />
          <div className="rdet__sheet" role="dialog" aria-label="Gekocht und bewerten">
            <div className="rdet__sheet-grab" />
            <h3>🥄 Gekocht — wie war's?</h3>
            <p>Sterne vergeben (optional) + Notiz</p>
            <div className="rdet__pickstars">
              {[1,2,3,4,5].map(n => (
                <button key={n} className={`rdet__pickstar ${n <= myStars ? 'on' : ''}`} onClick={() => setMyStars(n === myStars ? 0 : n)} aria-label={`${n} Sterne`}>
                  <Star size={30} fill={n <= myStars ? 'currentColor' : 'none'} strokeWidth={1.5} />
                </button>
              ))}
            </div>
            <textarea className="rdet__sheet-note" value={myNote} onChange={e => setMyNote(e.target.value)} placeholder="Notiz (optional) — 'Familie liebt es!'" rows={2} />
            <button className="rdet__sheet-save" onClick={saveCooked} disabled={cookSaving}>{cookSaving ? 'Speichere…' : '✓ Als gekocht speichern'}</button>
          </div>
        </>
      )}
    </div>
  );
}
