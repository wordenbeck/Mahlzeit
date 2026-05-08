import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './AppShell';
import { Onboarding } from './pages/Onboarding';
import { JoinByCode } from './pages/JoinByCode';
import {
  HeuteStub, PlanStub, EinkaufPruefenStub, EinkaufenStub, RezepteStub,
} from './pages/StubPages';

// Sprint-0-Prototypen bleiben unter /proto/* erhalten
import { ProtoIndex } from './pages/proto/ProtoIndex';
import { BoardA } from './pages/proto/BoardA';
import { BoardB } from './pages/proto/BoardB';
import { BoardC } from './pages/proto/BoardC';
import { CardGallery } from './pages/proto/CardGallery';
import { PhoneSketch } from './pages/proto/PhoneSketch';
import { WocheX } from './pages/proto/WocheX';
import { WocheY, WocheYListe } from './pages/proto/WocheY';
import { WocheZ, WocheZEinkaufen } from './pages/proto/WocheZ';
import {
  MenuIndex, MenuPills, MenuSidebar, MenuFlow, MenuFloating, MenuVerbal, MenuFinal,
} from './pages/proto/MenuPrototypes';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Onboarding + Join — KEINE App-Shell */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/join/:code" element={<JoinByCode />} />

        {/* App-Routes mit Shell + Auth-Guard */}
        <Route element={<AppShell />}>
          <Route path="/" element={<HeuteStub />} />
          <Route path="/plan" element={<PlanStub />} />
          <Route path="/einkauf" element={<EinkaufPruefenStub />} />
          <Route path="/liste" element={<EinkaufenStub />} />
          <Route path="/rezepte" element={<RezepteStub />} />
        </Route>

        {/* Prototypen — bleiben ungeschützt für Vergleich/Reference */}
        <Route path="/proto" element={<ProtoIndex />} />
        <Route path="/proto/board-a" element={<BoardA />} />
        <Route path="/proto/board-b" element={<BoardB />} />
        <Route path="/proto/board-c" element={<BoardC />} />
        <Route path="/proto/cards" element={<CardGallery />} />
        <Route path="/proto/phone" element={<PhoneSketch />} />
        <Route path="/proto/woche-x" element={<WocheX />} />
        <Route path="/proto/woche-y" element={<WocheY />} />
        <Route path="/proto/woche-y/liste" element={<WocheYListe />} />
        <Route path="/proto/woche-z" element={<WocheZ />} />
        <Route path="/proto/woche-z/einkaufen" element={<WocheZEinkaufen />} />
        <Route path="/proto/menu" element={<MenuIndex />} />
        <Route path="/proto/menu/pills" element={<MenuPills />} />
        <Route path="/proto/menu/sidebar" element={<MenuSidebar />} />
        <Route path="/proto/menu/flow" element={<MenuFlow />} />
        <Route path="/proto/menu/floating" element={<MenuFloating />} />
        <Route path="/proto/menu/verbal" element={<MenuVerbal />} />
        <Route path="/proto/menu/final" element={<MenuFinal />} />
      </Routes>
    </BrowserRouter>
  );
}
