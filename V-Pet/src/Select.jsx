import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "./firebase";
import NavButton from './NavButton'
import { useNavigate } from "react-router-dom";
import { auth } from './firebase';
import Pet from './Pet'

function Select({ onSave }) {
  const [characters, setCharacters] = useState([]);
  const user = auth.currentUser;

  console.log(user)
  
  useEffect(() => {
    if (!user) {
      navigate('/Login');
    }
    const charactersRef = ref(db, `users/${user.uid}/characters`);

    const unsubscribe = onValue(charactersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedCharacters = Object.entries(data).map(([id, value]) => ({
          id,
          ...value
        }));
        setCharacters(loadedCharacters);
      }
    });

    return () => unsubscribe();
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <div id="home-div">
        <h1 id="welcome-message">Your very own Pocket friends!</h1>
        <div id="home-buttons">
          <NavButton name="New Game" target="/Newgame" className="newgame-button" />
          <NavButton name="Read about us here" target="/Aboutus" className="aboutus-button" />
          <NavButton name="Login" target="/Login"/>

        </div>
        <div id="characters-list">
          <h2>Choose your character:</h2>
          <ul>
            {characters.map(ch => (
              <li key={ch.id} onClick={()=>navigate(`/Livingroom/${ch.id}`)}style={{
                backgroundColor: "azure",
                cursor: "pointer",
                border: "2px solid black",
                borderRadius: "15px",
                padding: "0.5rem 1rem",
                transition: "all 0.2s",
              }}>
                <img src={`/pictures/character-${ch.type}.png`} alt={ch.name} style={{
                  width: "100px",

                }} />
                <p style={{
                  color: "black"
                }}>{ch.name} ({ch.type})</p>
              </li>
            ))}
          </ul>
        </div>
        <p id="sponsor">The Photos Are sponsord by AI</p>
      </div>

    </>
  )
}
export default Select