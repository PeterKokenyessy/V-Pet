import { CharacterContext } from "./CharacterContext";
import { useState, useEffect, useRef } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "./firebase";
import { auth } from './firebase';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";



import HamGame from "./hamGame/hamGame";
import Bath from "./bathroom/Bath";
import Feeding from "./feeding/Feeding";
import NavButton from "./NavButton";
import Stats from "./Stats";

function Livingroom() {
  const [backgroundNumber, setBackgroundNumber] = useState(null);
  const [livingNumber, setLivingNumber] = useState(null);
  const [bathroomNumber, setBathroomNumber] = useState(null);
  const [character, setCharacter] = useState(null);
  const [feeding, setFeeding] = useState(false);
  const [isGame, setIsGame] = useState(false);
  const [isbathroom, setIsBathroom] = useState(false);

  const petRef = useRef(null);

  const {id} = useParams();


  const user = auth.currentUser;
  const userId = user.uid;
  const DATABASE_URL = "https://virtual-pet-caring-default-rtdb.europe-west1.firebasedatabase.app"
  const navigate = useNavigate();
  const characterRef = useRef(null);

  const handleBackGame = () => {
    setIsGame(false)
  }

  useEffect(() => {
    const charRef = ref(db, `/users/${userId}/characters/${id}`);
    const unsubscribe = onValue(charRef, (snapshot) => {
      if (snapshot.exists()) {
        let data = snapshot.val();

        if (data.lastSave) {
          const now = new Date();
          const lastSaveDate = new Date(data.lastSave);
          const diffMs = now - lastSaveDate;
          const diffMinutes = Math.floor(diffMs / 1000 / 60);

          const newStats = {
            hunger: Math.max(0, Math.min(100, (data.hunger || 100) - diffMinutes * 2)),
            happiness: Math.max(0, Math.min(100, (data.happiness || 100) - diffMinutes * 1)),
            energy: Math.max(0, Math.min(100, (data.energy || 100) - diffMinutes * 1)),
            clean: Math.max(0, Math.min(100, (data.clean || 100) - diffMinutes * 0.5)),
          };

          data = { ...data, ...newStats };
        }

        setCharacter(data);
      }
    });

    return () => unsubscribe();
  }, [id, userId]);

  useEffect(() => {
    characterRef.current = character;
  }, [character]);

  useEffect(() => {
    setBackgroundNumber(Math.floor(Math.random() * 4) + 1);
    setLivingNumber(Math.floor(Math.random() * 5) + 1);
    setBathroomNumber(Math.floor(Math.random() * 3) + 1);
  }, []);

  useEffect(() => {
    return () => {
      async function uploadDate() {
        if (!user) {
          navigate("/Login");
          return;
        }
        try {
          if (!characterRef.current) return;

          await fetch(`${DATABASE_URL}/users/${user.uid}/characters/${id}.json`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...characterRef.current,
              lastSave: new Date().toISOString(),
            }),
          });
        } catch (error) {
          console.log("Something went wrong during new date upload:", error);
        }
      }

      uploadDate();
    };
  }, [id, user, navigate]);

  if (!character) {
    return <p style={{ color: "black" }}>Loading character...</p>;
  }

  const livingroomImgSrc = `/pictures/livingroom-${livingNumber}.png`;
  const bathroomImgSrc = `/pictures/bathroom-${bathroomNumber}.png`

  function handleFeeding() {
    setFeeding(true);
    setTimeout(() => setFeeding(false), 2000);
    console.log(character);
  }

  return (
    <>
      {isGame ? (
        <>
          <CharacterContext.Provider value={{ character, setCharacter }}>
            <HamGame back={handleBackGame} />
          </CharacterContext.Provider>
        </>
      ) : (
        <>
          <button onClick={() => setIsGame(true)}
            className="gameBtn"
            >Game</button>
          <div
            id="background"
            style={{
              backgroundImage: `url(/pictures/background-${backgroundNumber}.png)`,
            }}
          >
            <NavButton name="Home" target="/Select" className="homeBtn" />
            <button
              onClick={() => setIsBathroom(!isbathroom)}
              className="bathroom-button"
            >
              {isbathroom ? "Livingroom" : "Bathroom"}
            </button>
            <div className="all-stats">
              <Stats currentCharacter={character} setCurrentCharacter={setCharacter} id={id} />
            </div>
            <div id="img-container">
              {livingNumber && (
                <img
                  id="livingroom"
                  src={isbathroom ? bathroomImgSrc : livingroomImgSrc}
                  alt="livingroom"
                />
              )}
              <img
                id="character"
                src={adjustCharacterMood(character)}
                alt={character.name}
                ref={petRef}
                style={{
                  position: "absolute",
                  bottom: positionBottomFixer(livingNumber, character.type),
                  left: positionLeftFixer(livingNumber),
                }}
              />
              <img
                src="https://i.pinimg.com/originals/99/65/33/996533dbc2e2768a6ad2cebf5ea11210.gif"
                alt="heart"
                className="feededEffect"
                style={{
                  display: feeding ? "block" : "none",
                  position: "absolute",
                  bottom: positionBottomFixer(livingNumber, character.type),
                  left: positionLeftFixer(livingNumber),
                }}
              />
            </div>
            <CharacterContext.Provider value={{ character, setCharacter }}>
              {isbathroom ? (
                <Bath petRef={petRef} />
              ) : (
                <Feeding petRef={petRef} feed={handleFeeding} />
              )}
            </CharacterContext.Provider>
          </div>
        </>
      )}
    </>
  );
}

function positionBottomFixer(livingNumber, type) {
  if (
    (livingNumber === 1 && (type === "cat" || type === "kapibara")) ||
    (livingNumber === 5 && type === "kapibara")
  ) {
    return "15%";
  }
  if (livingNumber === 3) {
    if (type === "cat") return "22%";
    return "15%";
  } else if (livingNumber === 2) {
    if (type === "kapibara") return "20%";
    if (type === "cat") return "22%";
    return "17%";
  }
  if (type === "cat") return "15%";
  if (type === "deer") return "15%";
  return "10%";
}

function positionLeftFixer(livingNumber) {
  if (livingNumber === 2 || livingNumber === 3) return "30%";
  return "31%";
}

function adjustCharacterMood(character) {

  function getStats(character) {
    return {
      hunger: character.hunger,
      clean: character.clean,
      happiness: character.happiness,
      energy: character.energy
    };
  }

  function getLowestStat(character){
    const stats = getStats(character);
    return Object.entries(stats).reduce(
      (lowest, current) => current[1] < lowest[1] ? current : lowest
    ); 
  }

  const [lowestKey, lowestValue] = getLowestStat(character);


  if (lowestValue < 60) {
    switch (lowestKey){
      case "hunger":
        return `/pictures/character-${character.type}-hungry.png`;
      case "clean":
        return `/pictures/character-${character.type}-dirty.png`;
      case "happiness":
        return `/pictures/character-${character.type}-sad.png`;
      case "energy":
        return `/pictures/character-${character.type}-sleepy.png`;
      default:
        return `/pictures/character-${character.type}.png`;
    }
  }

  return `/pictures/character-${character.type}.png`;
}


export default Livingroom;
