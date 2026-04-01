import React, { useState, useEffect, useContext } from 'react';
import "./Feeding.css";
import Shop from './Shop.jsx'
import { CharacterContext } from '../CharacterContext.jsx';


function Feeding({ petRef, feed }) {
    const {character,setCharacter} = useContext(CharacterContext);
    const [food, setFood] = useState(null);
    const [index, setIndex] = useState(null);
    const [overTarget, setOverTarget] = useState(false);
    const [inventoryIsOpen, setInventoryIsopen] = useState(false);
    const [shopIsOpen, setShopIsOpen] = useState(false);

    const [dragging, setDragging] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });


    useEffect(() => {
        if (character.inventory.length > 0) {
            setIndex(0);
            setFood(character.inventory[0]);
        }
    }, [character]);

    useEffect(() => {
        if (index !== null && character.inventory.length > 0) {
            setFood(character.inventory[index]);
        }
    }, [index, character]);
    
    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    });

    const feedingStatRefreshing = (item) => {
        if(item){
            setCharacter(prev => {
                return{
                    ...prev,
                    clean: Math.min(100, Math.max(0, prev.clean + item.effect.clean)),
                    energy: Math.min(100, Math.max(0, prev.energy + item.effect.energy)),
                    happiness: Math.min(100, Math.max(0, prev.happiness + item.effect.happiness)),
                    hunger: Math.min(100, Math.max(0, prev.hunger + item.effect.healthPlus)),
                }


            })
        }
    }

   const feeding = (actualFood) => {
    if (!actualFood) return;

    setCharacter(prev => {
        let updatedInventory = prev.inventory.map(item =>
            item.id === actualFood.id
                ? { ...item, count: item.count - 1 }
                : item
        );
        
        updatedInventory = updatedInventory.filter(item => item.count > 0);

        const updated = {
            ...prev,
            inventory: updatedInventory,
            clean: Math.min(100, Math.max(0, prev.clean + actualFood.effect.clean)),
            energy: Math.min(100, Math.max(0, prev.energy + actualFood.effect.energy)),
            happiness: Math.min(100, Math.max(0, prev.happiness + actualFood.effect.happiness)),
            hunger: Math.min(100, Math.max(0, prev.hunger + actualFood.effect.healthPlus)),
        };

        return updated;
    });
};


    const handlePrevious = () => {
        setIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : character.inventory.length - 1));
    };

    const handleNext = () => {
        setIndex((prevIndex) => (prevIndex < character.inventory.length - 1 ? prevIndex + 1 : 0));
    };

    const handleMouseDown = (e) => {
        setDragging(true);
        setPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setDragging(false);

        if (overTarget) {
            feeding(food, character, character.setInventory)
            feed()
            setOverTarget(false);
        }
    };

    const handleMouseMove = (e) => {
        e.preventDefault();
        if (dragging) {
            const { clientX, clientY } = e;
            setPos({ x: clientX, y: clientY });

            const petRect = petRef.current?.getBoundingClientRect();

            const isOverPet =
                petRect &&
                clientX >= petRect.left &&
                clientX <= petRect.right &&
                clientY >= petRect.top &&
                clientY <= petRect.bottom;

            setOverTarget(isOverPet);


        }
    };


    const handleBack = () => {
        setShopIsOpen(false)
    }

    return (
        <>
            <div className="FeedingDownBar">
                <button onClick={() => setInventoryIsopen(true)}>
                    <img src="/pictures/fridge.png" alt="fridge" className="fridge" />
                </button>

                <div className="foodContanier">
                    <button onClick={handlePrevious}>⬅️</button>

                    <span
                        onMouseDown={handleMouseDown}
                        className='noSelect'
                        style={{ cursor: "grab" }}
                    >
                        {food && food.display}
                    </span>

                    <button onClick={handleNext}>➡️</button>
                </div>

                <button onClick={() => setShopIsOpen(true)}>
                    <img src="/pictures/shop.png" alt="shop" className='shop' />
                </button>

            </div>

            {dragging && food && (
                <div
                    style={{
                        position: "fixed",
                        left: pos.x,
                        top: pos.y,
                        pointerEvents: "none",
                        fontSize: overTarget ? "3rem" : "2rem",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    {food.display}
                </div>
            )}

            {inventoryIsOpen && (
                <div className='inventory'>
                    <button onClick={() => setInventoryIsopen(false)} className='inventoryCloseBtn'>❌</button>
                    {character.inventory.map((item) => {
                        return (
                            <div key={item.id} className='itemsContainer'>
                                <div className='item'>{item.display}</div>
                                <span className='price'>{item.count}</span>
                            </div>
                        )
                    })}
                </div>
            )}
            {shopIsOpen &&(     
                <Shop back={handleBack}/>
            )}
        </>
    );
}

export default Feeding;
