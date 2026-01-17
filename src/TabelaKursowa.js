import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export function TabelaKursowa() {
  const [tabelaKursowa, setTabelaKursowa] = useState(null);
  const [wybranaTabela, setWybranaTabela] = useState("A");

  useEffect(() => {
    setTabelaKursowa(null);

    fetch(`https://api.nbp.pl/api/exchangerates/tables/${wybranaTabela}/last/1/?format=json`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Błąd pobierania danych");
        }
        return response.json();
      })
      .then(data => {
        setTabelaKursowa(data[0].rates);
      })
      .catch(error => {
        console.error(`Błąd pobierania tabeli kursowej ${wybranaTabela}:`, error);
      });
  }, [wybranaTabela]);


  // zmiana tabeli na wartość z radio button
  const handleChangeSelect = (event) => {
    setWybranaTabela(event.target.value);
  };

  return (
    <div>
      <h3>Tabela kursowa - {wybranaTabela}</h3>

      <div>
        <label>
          Wybierz tabelę:{" "}
          <select value={wybranaTabela} onChange={handleChangeSelect}>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </label>
        <br />
        <br />
      </div>

      {tabelaKursowa ? (
        <>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>waluta</th>
                <th>kod ISO 4217</th>
                <th>kurs (PLN)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tabelaKursowa.map((waluta) => (
                <tr key={waluta.code}>
                  <td>{waluta.currency}</td>
                  <td>{waluta.code}</td>
                  <td>
                    {waluta.mid !== undefined
                      ? waluta.mid.toFixed(4)
                      : `${waluta.bid.toFixed(4)} / ${waluta.ask.toFixed(4)}`}
                  </td>
                  <td>
                    <Link to={`/tabela-kursowa/${waluta.code}`}>
                      szczegóły..
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Ładowanie...</p>
      )}
    </div>
  );
}
