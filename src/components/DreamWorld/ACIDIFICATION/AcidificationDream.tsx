import React, { useState, useEffect } from "react";
import "./AcidificationDream.css";

type WastePosition = {
  x: number;
  y: number;
  type: number;
  id: number;
};

export const AcidificationDream = () => {
  const [acidity, setAcidity] = useState<number>(100);
  const [message, setMessage] = useState<string>(
    "Éliminez les déchets pour réduire l'acidité."
  );
  const [timeSinceLastClick, setTimeSinceLastClick] = useState<number>(0);
  const [lastId, setLastId] = useState<number>(0);
  const [wastePositions, setWastePositions] = useState<WastePosition[]>([]);

  const wasteSpeed = 5;

  const calculateOceanColor = (acidity: number): string => {
    const red = Math.min(255, Math.floor((acidity / 100) * 255));
    const green = Math.min(255, Math.floor((acidity / 100) * 255));
    const blue = Math.max(0, Math.floor(255 - (acidity / 100) * 255));
    return `rgb(${red}, ${green}, ${blue})`;
  };

  const getRandomPosition = (id: number): WastePosition => {
    const x = Math.random() * 100;
    const y = -15;
    const type = Math.floor(Math.random() * 3) + 1;
    return { x, y, type, id };
  };

  const handleWasteClick = (id: number) => {
    setAcidity((prevAcidity) => Math.max(0, prevAcidity - 5));
    setTimeSinceLastClick(0);
    setWastePositions((prevPositions) =>
      prevPositions.filter((pos) => pos.id !== id)
    );
    if (acidity <= 1) {
      setMessage("Bravo ! Vous avez neutralisé l'acidité !");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (wastePositions.length < 10) {
        setWastePositions((prevPositions) => {
          const newId = lastId + 1;
          setLastId(newId);
          return [...prevPositions, getRandomPosition(newId)];
        });
      }

      setWastePositions((prevPositions) =>
        prevPositions
          .map((pos) => ({
            ...pos,
            y: Math.min(100, pos.y + wasteSpeed),
          }))
          .filter((pos) => pos.y < 100)
      );

      setTimeSinceLastClick((prevTime) => prevTime + 0.5);

      if (acidity <= 5) {
        setMessage("L'acidité est presque neutralisée, continuez !");
      } else if (acidity >= 95) {
        setMessage("L'acidité augmente dangereusement ! Agissez vite !");
      }

      if (acidity === 0) {
        setMessage("Félicitations, vous avez neutralisé l'acidité !");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [timeSinceLastClick, lastId, acidity, wastePositions]);

  return (
    <div className="container">
      <h3>Acidification - Défi Difficile</h3>
      <p>{message}</p>
      {acidity === 0 && (
        <div>
          <div className="congratulatory-message">
            Félicitations, vous avez neutralisé l'acidité !
          </div>
          <div className="redirection-message">Redirection en cours...</div>
        </div>
      )}
      <div
        className="game-area"
        style={{ backgroundColor: calculateOceanColor(acidity) }}
      >
        <div className="sea">
          {wastePositions.map((pos) => (
            <img
              key={pos.id}
              src={`dechet${pos.type}.png`}
              alt={`Déchet ${pos.type}`}
              className="waste"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => handleWasteClick(pos.id)}
            />
          ))}
        </div>
      </div>
      <p>Acidité restante : {acidity}%</p>
    </div>
  );
};

export default AcidificationDream;
