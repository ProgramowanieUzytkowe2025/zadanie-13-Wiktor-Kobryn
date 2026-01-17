import { useState, useEffect } from "react";

export function CenaZlota() {
  const [cena, setCena] = useState(null);

  useEffect(() => {
    fetch("https://api.nbp.pl/api/cenyzlota/last/1/") // ostatnia dostępna cena - dzień roboczy
      .then(response => response.json())
      .then(data => {
        setCena(data[0].cena);
      })
      .catch(error => {
        console.error("Błąd pobierania ceny złota z api NBP:", error);
      });
  }, []);

  return (
    <div>
      <h3>Aktualna cena złota</h3>
      {cena !== null ? (
        <p>{cena} PLN</p>
      ) : (
        <p>Ładowanie...</p>
      )}
    </div>
  );
}
