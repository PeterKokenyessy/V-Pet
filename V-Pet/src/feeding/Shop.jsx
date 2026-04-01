import React, { useContext } from 'react'
import data from './foods.json'
import './Shop.css'
import { CharacterContext } from '../CharacterContext'

function Shop({back}) {

  const {character,setCharacter} = useContext(CharacterContext);



const handleChanges = (item) => {
  if(character.money < item.price) return
  setCharacter(prev => {
    const existingItemIndex = prev.inventory.findIndex(el => el.id === item.id);

    const updatedInventory = existingItemIndex !== -1
      ? prev.inventory.map((el, idx) =>
          idx === existingItemIndex
            ? { ...el, count: el.count + 1 }
            : el
        )
      : [...prev.inventory, { ...item, count: 1 }];

    return {
      ...prev,
      money: prev.money - item.price, 
      inventory: updatedInventory,
    };
  });
};



  return (
    <div className='shopContanier'>
      <button className='backBtn'
      onClick={() => back()}
      >❌</button>
        {data && character && (
          data.map((e) => {
            const actualFood = character.inventory?.find(el => el.id === e.id)
            
            
            return(
              <div className='foods'
                key={e.id}
              >
                <p className='foord-price'>🪙{e.price}</p>
              <button
              className='foodBtn'
              onClick={() => character.money >= 0 && handleChanges(e)}
              >{e.display}</button>
              
              <p className="food-count">{actualFood ? actualFood.count : 0 }</p>
              </div>
            )
          })
        )}
    </div>
  )
}

export default Shop