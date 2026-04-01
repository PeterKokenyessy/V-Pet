import "./stats.css";
import { useEffect, useState } from "react";
const DATABASE_URL = "https://virtual-pet-caring-default-rtdb.europe-west1.firebasedatabase.app"

// lementeni az épp aktuális dátumot/időt mikor bezárjuk az appot.
// Megnyitáskor a már előre lementett és épp az aktuális időből számítjuk ki az új statok értékét

function Stats({ currentCharacter, setCurrentCharacter , id }) {
  console.log("character", currentCharacter)

  const StatsBar = ({ label, value, color }) => (
    <div className="stat">
      <p style={{ fontSize: 20 }}>{label}:{value}</p>
      <div className="stat-bar">
        <div
          className="stat-fill"
          style={{
            width: `${value}%`,
            backgroundColor: color(value),
          }}
        />
      </div>
    </div>
  );

  useEffect(() => {
    if (!currentCharacter) return;

    const interval = setInterval(() => {
      setCurrentCharacter(prev => {
        const updated = {
          ...prev,
          hunger: Math.max(prev.hunger - 2, 0),
          clean: parseInt(Math.max(prev.clean - 1.5, 0)),
          happiness: Math.max(prev.happiness - 0.5, 0),
          energy: Math.max(prev.energy - 1, 0),
        };

        return updated;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [currentCharacter,setCurrentCharacter , id]);


  return (
    <>
      {currentCharacter && (
        <div className="stats-div">
          <StatsBar
            label="Hunger"
            value={currentCharacter.hunger}
            color={(val) => (val > 50 ? "green" : val > 20 ? "orange" : "red")}
          />
          <StatsBar
            label="Energy"
            value={currentCharacter.energy}
            color={(val) => (val > 50 ? "green" : val > 20 ? "orange" : "red")}
          />
          <StatsBar
            label="Happiness"
            value={currentCharacter.happiness}
            color={(val) => (val > 50 ? "green" : val > 20 ? "orange" : "red")}
          />
          <StatsBar
            label="Clean"
            value={currentCharacter.clean}
            color={(val) => (val > 50 ? "green" : val > 20 ? "orange" : "red")}
          />
          <p>🪙{currentCharacter.money}</p>
        </div>
      )}
    </>
  )
}

export default Stats