import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './AppShell';
import { Onboarding } from './pages/Onboarding';
import { JoinByCode } from './pages/JoinByCode';
import { Heute } from './pages/Heute';
import { Rezepte } from './pages/Rezepte';
import { RezeptImport } from './pages/RezeptImport';
import { RezeptDetail } from './pages/RezeptDetail';
import { Plan } from './pages/Plan';
import { Einkauf } from './pages/Einkauf';
import { Liste } from './pages/Liste';
import { Profile } from './pages/Profile';

// Sprint-0-Prototypen lazy-loaded (separates Bundle, nicht im Haupt-Bundle)
const ProtoIndex = lazy(() => import('./pages/proto/ProtoIndex').then(m => ({ default: m.ProtoIndex })));
const BoardA = lazy(() => import('./pages/proto/BoardA').then(m => ({ default: m.BoardA })));
const BoardB = lazy(() => import('./pages/proto/BoardB').then(m => ({ default: m.BoardB })));
const BoardC = lazy(() => import('./pages/proto/BoardC').then(m => ({ default: m.BoardC })));
const CardGallery = lazy(() => import('./pages/proto/CardGallery').then(m => ({ default: m.CardGallery })));
const PhoneSketch = lazy(() => import('./pages/proto/PhoneSketch').then(m => ({ default: m.PhoneSketch })));
const WocheX = lazy(() => import('./pages/proto/WocheX').then(m => ({ default: m.WocheX })));
const WocheY = lazy(() => import('./pages/proto/WocheY').then(m => ({ default: m.WocheY })));
const WocheYListe = lazy(() => import('./pages/proto/WocheY').then(m => ({ default: m.WocheYListe })));
const WocheZ = lazy(() => import('./pages/proto/WocheZ').then(m => ({ default: m.WocheZ })));
const WocheZEinkaufen = lazy(() => import('./pages/proto/WocheZ').then(m => ({ default: m.WocheZEinkaufen })));
const MenuIndex = lazy(() => import('./pages/proto/MenuPrototypes').then(m => ({ default: m.MenuIndex })));
const MenuPills = lazy(() => import('./pages/proto/MenuPrototypes').then(m => ({ default: m.MenuPills })));
const MenuSidebar = lazy(() => import('./pages/proto/MenuPrototypes').then(m => ({ default: m.MenuSidebar })));
const MenuFlow = lazy(() => import('./pages/proto/MenuPrototypes').then(m => ({ default: m.MenuFlow })));
const MenuFloating = lazy(() => import('./pages/proto/MenuPrototypes').then(m => ({ default: m.MenuFloating })));
const MenuVerbal = lazy(() => import('./pages/proto/MenuPrototypes').then(m => ({ default: m.MenuVerbal })));
const MenuFinal = lazy(() => import('./pages/proto/MenuPrototypes').then(m => ({ default: m.MenuFinal })));

const ProtoFallback = () => (
  <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)' }}>Lade Prototyp…</div>
);

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Onboarding + Join — KEINE App-Shell */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/join/:code" element={<JoinByCode />} />

        {/* App-Routes mit Shell + Auth-Guard */}
        <Route element={<AppShell />}>
          <Route path="/" element={<Heute />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/einkauf" element={<Einkauf />} />
          <Route path="/liste" element={<Liste />} />
          <Route path="/rezepte" element={<Rezepte />} />
          <Route path="/rezepte/import" element={<RezeptImport />} />
          <Route path="/rezepte/:id" element={<RezeptDetail />} />
          <Route path="/profil" element={<Profile />} />
        </Route>

        {/* Prototypen — lazy loaded */}
        <Route path="/proto" element={<Suspense fallback={<ProtoFallback />}><ProtoIndex /></Suspense>} />
        <Route path="/proto/board-a" element={<Suspense fallback={<ProtoFallback />}><BoardA /></Suspense>} />
        <Route path="/proto/board-b" element={<Suspense fallback={<ProtoFallback />}><BoardB /></Suspense>} />
        <Route path="/proto/board-c" element={<Suspense fallback={<ProtoFallback />}><BoardC /></Suspense>} />
        <Route path="/proto/cards" element={<Suspense fallback={<ProtoFallback />}><CardGallery /></Suspense>} />
        <Route path="/proto/phone" element={<Suspense fallback={<ProtoFallback />}><PhoneSketch /></Suspense>} />
        <Route path="/proto/woche-x" element={<Suspense fallback={<ProtoFallback />}><WocheX /></Suspense>} />
        <Route path="/proto/woche-y" element={<Suspense fallback={<ProtoFallback />}><WocheY /></Suspense>} />
        <Route path="/proto/woche-y/liste" element={<Suspense fallback={<ProtoFallback />}><WocheYListe /></Suspense>} />
        <Route path="/proto/woche-z" element={<Suspense fallback={<ProtoFallback />}><WocheZ /></Suspense>} />
        <Route path="/proto/woche-z/einkaufen" element={<Suspense fallback={<ProtoFallback />}><WocheZEinkaufen /></Suspense>} />
        <Route path="/proto/menu" element={<Suspense fallback={<ProtoFallback />}><MenuIndex /></Suspense>} />
        <Route path="/proto/menu/pills" element={<Suspense fallback={<ProtoFallback />}><MenuPills /></Suspense>} />
        <Route path="/proto/menu/sidebar" element={<Suspense fallback={<ProtoFallback />}><MenuSidebar /></Suspense>} />
        <Route path="/proto/menu/flow" element={<Suspense fallback={<ProtoFallback />}><MenuFlow /></Suspense>} />
        <Route path="/proto/menu/floating" element={<Suspense fallback={<ProtoFallback />}><MenuFloating /></Suspense>} />
        <Route path="/proto/menu/verbal" element={<Suspense fallback={<ProtoFallback />}><MenuVerbal /></Suspense>} />
        <Route path="/proto/menu/final" element={<Suspense fallback={<ProtoFallback />}><MenuFinal /></Suspense>} />
      </Routes>
    </BrowserRouter>
  );
}
