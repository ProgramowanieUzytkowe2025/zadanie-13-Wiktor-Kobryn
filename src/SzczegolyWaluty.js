import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export function SzczegolyWaluty() {
  // dane waluty
  const { waluta } = useParams(); // kod waluty - ISO 4217
  const [pobraneDane, setPobraneDane] = useState(null);

  // dane - formularz
  const [kwota, setKwota] = useState(0.0);
  const dzisiejszaData = new Date();
  const [data, setData] = useState(dzisiejszaData.toISOString().split("T")[0]);
  const [wynik, setWynik] = useState(null);
  const [blad, setBlad] = useState("");

  // pobranie ostatniego kursu waluty
  useEffect(() => {
    fetch(`https://api.nbp.pl/api/exchangerates/rates/A/${waluta}/last/1/?format=json`)
      .then(response => {
        if (!response.ok) throw new Error("Brak danych");
        return response.json();
      })
      .then(data => setPobraneDane(data))
      .catch(error => {
        console.error("Błąd pobierania szczegółów waluty:", error);
      });
  }, [waluta]);

  // obsługa formularza - przeliczenie waluty z kursem z podanego dnia
  const przeliczWaluteSubmit = async (e) => {
    e.preventDefault();
    setBlad("");
    setWynik(null);

    if (kwota <= 0) {
      setBlad("Podano nieprawidłową kwotę");
      return;
    }

    let dataDoSprawdzenia = data;
    let kurs = null;

    while (!kurs) {
      try {
        const response = await fetch(`https://api.nbp.pl/api/exchangerates/rates/A/${waluta}/${dataDoSprawdzenia}/?format=json`);
        if (!response.ok) throw new Error("Brak notowania dla wybranej daty");
        const dane = await response.json();
        kurs = dane.rates[0].mid;
      } catch {
        // brak danych powoduje cofnięcie daty o 1 dzień
        const poprzedniDzien = new Date(dataDoSprawdzenia);
        poprzedniDzien.setDate(poprzedniDzien.getDate() - 1);
        dataDoSprawdzenia = poprzedniDzien.toISOString().split("T")[0];
       
        setBlad(`[Data pobranego kursu: ${dataDoSprawdzenia}]`)
      }
    }

    setWynik((kwota * kurs).toFixed(2));
  };

  if (!pobraneDane) {
    return <p>Ładowanie...</p>;
  }

  return (
    <div>
      <h3>Szczegóły waluty - {waluta}</h3>
      <div><strong>pełna nazwa:</strong> {pobraneDane.currency}</div>
      <div><strong>aktualny kurs: </strong> {pobraneDane.rates[0].mid.toFixed(4)} PLN</div>

      <h3>Przelicz kwotę na PLN</h3>
      <form onSubmit={przeliczWaluteSubmit}>
        <div>
          <label>
            Kwota w {waluta}: <input type="number" step="0.01" value={kwota} onChange={(e) => setKwota(e.target.value)} required/>
          </label>
        </div>
        <div>
          <label>
            Kurs z daty: <input type="date" value={data} onChange={(e) => setData(e.target.value)} required/>
          </label>
        </div>
        <button type="submit">Przelicz</button>
      </form>

      {wynik && <div><strong>Przeliczona kwota:</strong> {wynik} PLN</div>}
      {blad && <div style={{ color: "red" }}>{blad}</div>}
    </div>
  );
}
