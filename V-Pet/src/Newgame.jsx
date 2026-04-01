import { useLocation, useNavigate } from 'react-router';
import { useState } from 'react'
import NavButton from './NavButton';
import { auth } from './firebase';


const characters = ["cat", "kapibara", "dog", "deer", "bunny", "hamster", "wolf"]
const DATABASE_URL = "https://virtual-pet-caring-default-rtdb.europe-west1.firebasedatabase.app"
const user = auth.currentUser;

function NewGame({ onSave }) {
  const [customName, setCustomName] = useState("");
  const navigate = useNavigate();
  const targetPage = `/Livingroom`

  async function handleClick(ch) {
    const user = auth.currentUser;

    if (!customName) {
      alert("Enter name")
      return;
    }
    if (!user) {
      alert("You must be logged in to create a character!");
      return;
    }

    try {
      const response = await fetch(`${DATABASE_URL}/users/${user.uid}/characters.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: ch,
          name: customName,
          hunger: 70,
          happiness: 50,
          energy: 60,
          clean: 100,
          money: 450,
          inventory: [
            {
              "id": 1,
              "display": "🍕",
              "price": 1.5,
              "effect": {
                "healthPlus": 30,
                "clean": -10,
                "energy": 10,
                "happiness": 10
              },
              "count": 5
            },
            {
              "id": 2,
              "display": "🍔",
              "price": 2.0,
              "effect": {
                "healthPlus": 25,
                "clean": -15,
                "energy": 15,
                "happiness": 15
              },
              "count": 2
            },
            {
              "id": 8,
              "display": "🍫",
              "price": 2.0,
              "effect": {
                "healthPlus": 5,
                "clean": -5,
                "energy": 25,
                "happiness": 25
              },
              "count": 3
            },
            {
              "id": 12,
              "display": "🍺",
              "price": 2.5,
              "effect": {
                "healthPlus": -5,
                "clean": -20,
                "energy": -5,
                "happiness": 40
              },
              "count": 10
            },
          ]
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save character");
      }
      const result = await response.json();
      const newId = result.name;
      //navigate(`/Livingroom/${ch.id}`)
      navigate(`/Livingroom/${newId}`, { state: { character: ch } });


    } catch (error) {
      console.error("Error saving character:", error);
    }
  }

  function listAllCharacters(characters) {
    return (
      <div>
        <NavButton name="Home" target="/Select" className="homeBtn" />
        <h1 id="newGame-title">Select a character!</h1>
        <ul id="selecting">
          {characters.map(ch => (
            <li onClick={() => handleClick(ch)} key={ch} >
              <img src={`/pictures/character-${ch}.png`} alt={ch}
                style={{
                  width: "70%"
                }} />
              <p>{ch}</p>
            </li>
          ))}
        </ul>
        <input
          id="new-name"
          value={customName}
          onChange={(event) => setCustomName(event.target.value)} />

        <p style={{
          position: "absolute",
          left: "45%",
          bottom: "7%",
          backgroundColor: "antiquewhite",
          borderRadius: "5px"
        }}
        >⬆️Type his/her name⬆️</p>
      </div>
    )
  }

  return (
    <>
      <div id="newGame-div">
        {listAllCharacters(characters)}
      </div>
    </>
  )
}

export default NewGame