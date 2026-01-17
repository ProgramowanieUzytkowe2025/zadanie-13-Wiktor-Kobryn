import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { TabelaKursowa } from './TabelaKursowa';
import { CenaZlota } from './CenaZlota';
import { Autor } from './Autor';
import { SzczegolyWaluty } from './SzczegolyWaluty';

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <label>NAWIGACJA: </label>
        <Link to="/tabela-kursowa">Tabela Kursowa</Link> |{" "}
        <Link to="/cena-zlota">Cena Złota</Link> |{" "}
        <Link to="/autor">Autor</Link>
      </nav>

      <Routes>
        <Route path="/tabela-kursowa" element={<TabelaKursowa />} />
        <Route path="/tabela-kursowa/:waluta" element={<SzczegolyWaluty />} />
        <Route path="/cena-zlota" element={<CenaZlota />} />
        <Route path="/autor" element={<Autor />} />
      </Routes>
    </BrowserRouter>
  );
}
