import React, { useContext } from 'react'
import { useState, useEffect, useRef } from "react";
import "./Bath.css";
import {CharacterContext} from "../CharacterContext"



function Bath({ petRef }) {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [actualItem, setactualItem] = useState(null);
    const [soapCount, setSoapCount] = useState(0);
    const {setCharacter} =useContext(CharacterContext)
    const [cleanProgress, setCleanProgress] = useState(0);


    const dragRef = useRef(null);
    const dirtyRef = useRef(null);


    const handleMouseDown = (e, item) => {
        setactualItem(item);
        setDragging(true);
        setPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setDragging(false)
    }

    const handleMouseMove = (e) => {
        e.preventDefault();
        if (dragging) {
            const { clientX, clientY } = e;
            setPos({ x: clientX, y: clientY });

            const petRect = petRef.current?.getBoundingClientRect();
            const dragRect = dragRef.current?.getBoundingClientRect();

            if (petRect && dragRect) {
                const isOverPet =
                    dragRect.left < petRect.right &&
                    dragRect.right > petRect.left &&
                    dragRect.top < petRect.bottom &&
                    dragRect.bottom > petRect.top;


                if (isOverPet) {
                    setSoapCount(prev => {
                        const increment = 0.1;
                        setCleanProgress(prevProg => {
                        const total = prevProg + increment;

                        if (total >= 1) {
                            setCharacter(prev => ({
                                ...prev,
                                clean: Math.min(prev.clean + 0.5, 100),
                            }));
                            return total - 1;
                        }
                            return total;
                        });

                        if (actualItem === "🧼") {
                            return Math.min(prev + 0.01, 1);
                        }
                        if (actualItem === "🚿") {
                            return Math.max(prev - 0.01, 0);
                        }
                        return prev;
                    });
                }
            }
        }
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    });

    useEffect(() => {
        if (petRef.current && dirtyRef.current) {
            const petRect = petRef.current.getBoundingClientRect();

            dirtyRef.current.style.position = "absolute";
            dirtyRef.current.style.left = petRect.left + "px";
            dirtyRef.current.style.top = petRect.top + "px";
            dirtyRef.current.style.width = petRect.width + "px";
            dirtyRef.current.style.height = petRect.height + "px";
        }
    }, [])


    return (
        <>
            <img src="../pictures/hab.png" alt="dirty"
                ref={dirtyRef}
                className='soapingEffect'

                style={{
                    opacity: soapCount,
                    top: "48%",
                    transform: "scale(1.2)"
                }}
            />
            <div className='container'>
                <div className='soap'
                    onMouseDown={(e) => handleMouseDown(e, "🧼")}
                >
                    🧼
                </div>
                <div className='shoverContainer'>
                    <div
                        className='shover'
                        onMouseDown={(e) => handleMouseDown(e, "🚿")}
                    >
                        🚿
                    </div>
                </div>
            </div>

            {dragging && actualItem && (
                <div
                    ref={dragRef}
                    style={{
                        position: "fixed",
                        left: pos.x,
                        top: pos.y,
                        pointerEvents: "none",
                        fontSize: "30px",
                        transform: "translate(-5%,-5%)",
                    }}
                >
                    {actualItem === "🚿" ? (
                        <>
                            <span className='activeShover'>
                                🚿
                            </span>
                            <img
                                src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTV0amFzZmRwaXN1cDVja3l3ZGE2cWV6YzBsMWszMTU1YmxoejY5dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/13QCrvGE0wwdYIy5P5/giphy.gif"
                                alt="shovereffect"
                                className='shoverEffect'
                            />
                        </>
                    ) : (
                        <>
                            <span>
                                🧼
                            </span>
                        </>
                    )}
                </div>
            )}

        </>
    )
}

export default Bath