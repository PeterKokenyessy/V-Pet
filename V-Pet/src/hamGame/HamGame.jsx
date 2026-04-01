import React, { useContext, useEffect, useState, useRef } from 'react';
import { CharacterContext } from '../CharacterContext';
import { motion } from "framer-motion";
import "./HamGame.css";
import { useParams } from 'react-router-dom';

const URL = 'https://virtual-pet-caring-default-rtdb.europe-west1.firebasedatabase.app/users.json'



async function getLeaderBoard(id) {
    
    const fethAll = async () => {
        try {
            const res = await fetch(URL);
            const data = await res.json();
            return data;
        } catch (err) {
            console.log(err);
        }
    }

    const data = await fethAll(URL);
    console.log(data);

    const result = [];

    for (const [userKey, user] of Object.entries(data)) {
        if (user.characters) {
            console.log("dataype" , user.characters);
            for (const [charkey,character] of Object.entries(user.characters)) {
                

            
                if (character.gameRecor) {
                    const actualPet = id === charkey ? true : false
       
                    const newdata = {
                        actualPet: actualPet,
                        name: character.name,
                        score: character.gameRecor,
                    };
                    result.push(newdata);
                }
            }
        }
    }

    console.log(result);

    return result.sort((a,b) => b.score-a.score);
}




function useSound(src) {
    const soundRef = useRef(null);


    useEffect(() => {
        soundRef.current = new Audio(src);
        soundRef.current.volume = 0.5;
        return () => {
            soundRef.current.pause();
            soundRef.current = null;
        };
    }, [src]);

    const play = () => {
        if (soundRef.current) {
            soundRef.current.currentTime = 0;
            soundRef.current.play().catch(err => console.log(err));
        }
    };

    return play;
}


function HamGame({ back }) {
    const DATABASE_URL = "https://virtual-pet-caring-default-rtdb.europe-west1.firebasedatabase.app"
    const foods = ["🍕", "🍔", "🌭", "🍟", "🍣", "🥗", "🍰", "🍫", "🍩", "🍎", "☕", "🥤"];
    const badfoods = ["🍺", "🍸", "🍷"];

    const { character, setCharacter } = useContext(CharacterContext);
    const {id} = useParams()

    const [cursorPos, setCursorPos] = useState(window.innerWidth / 2);
    const [foodsState, setFoodsState] = useState([]);
    const foodsRef = useRef([]);
    const foodElsRef = useRef(new Map());

    const idCounter = useRef(0);
    const characterRef = useRef(null);

    const [score, setScore] = useState(0);
    const scoreRef = useRef(score);
    const [badCount, setBadCount] = useState(0);

    const [intervalTime, setIntervalTime] = useState(2000);

    const [isRunning, setIsRunning] = useState(true);
    const [gameOver, setGameOver] = useState(false);

    const spawnIntervalRef = useRef(null);
    const rafIdRef = useRef(null);
    const [leaderBoard, setLeaderBoard] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const data = await getLeaderBoard(id);
            console.log("data", data);

            setLeaderBoard(data);
        };
        fetchLeaderboard();


    }, []);


    const playGood = useSound("/sound/good.mp3");
    const playBad = useSound("/sound/mistake.mp3");

    useEffect(() => {
        scoreRef.current = score
    }, [score])

    const setFoods = (updater) => {
        setFoodsState(prev => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            foodsRef.current = next;
            return next;
        });
    };

    useEffect(() => {
        const handleMouseMove = (e) => setCursorPos(e.clientX);
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        if (!isRunning) return;

        spawnIntervalRef.current = setInterval(() => {
            const isBad = Math.random() < 0.18;
            const food = {
                id: idCounter.current++,
                emoji: isBad ? badfoods[Math.floor(Math.random() * badfoods.length)]
                    : foods[Math.floor(Math.random() * foods.length)],
                x: Math.random() * (window.innerWidth - 50),
                isBad
            };
            setFoods(prev => [...prev, food]);
        }, intervalTime);

        return () => {
            if (spawnIntervalRef.current) {
                clearInterval(spawnIntervalRef.current);
                spawnIntervalRef.current = null;
            }
        };
    }, [isRunning, intervalTime]);

    useEffect(() => {
        if (score > 0 && score % 5 === 0) {
            setIntervalTime(prev => Math.max(150, prev - 200));
        }
    }, [score]);

    const rectsIntersect = (r1, r2) => {
        return !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
    };

    const handleCollision = (food) => {
        if (!foodsRef.current.find(f => f.id === food.id)) return;

        if (food.isBad) {
            setBadCount(b => {
                const next = b + 1;
                if (next >= 3) {
                    endGame();
                }
                return next;
            });
            playBad();
        } else {
            playGood();
            setScore(s => s + 1);
        }

        setFoods(prev => prev.filter(f => f.id !== food.id));
        foodElsRef.current.delete(food.id);
    };

    const onFoodAnimationEnd = (id) => {
        if (!foodsRef.current.find(f => f.id === id)) return;
        setFoods(prev => prev.filter(f => f.id !== id));
        foodElsRef.current.delete(id);
    };


    useEffect(() => {
        if (!isRunning) return;

        let rafId = null;
        const loop = () => {
            const charEl = characterRef.current;
            if (charEl) {
                const charRect = charEl.getBoundingClientRect();
                for (const food of foodsRef.current) {
                    const el = foodElsRef.current.get(food.id);
                    if (!el) continue;
                    const foodRect = el.getBoundingClientRect();
                    if (rectsIntersect(foodRect, charRect)) {
                        handleCollision(food);
                    }
                }
            }
            rafId = requestAnimationFrame(loop);
            rafIdRef.current = rafId;
        };

        rafId = requestAnimationFrame(loop);
        rafIdRef.current = rafId;

        return () => {
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
        };
    }, [isRunning]);

    const endGame = () => {
        if (spawnIntervalRef.current) {
            clearInterval(spawnIntervalRef.current);
            spawnIntervalRef.current = null;
        }

        if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
        }

        
        setFoods([]);
        
        foodElsRef.current.clear();
        
        const finalScore = scoreRef.current;
        const updated = {
            ...character,
            money: (character.money || 0) + finalScore,
            gameRecor: character.gameRecor > finalScore ? character.gameRecor : finalScore,
        };
        
        setLeaderBoard((prev) => {
            let found = false;
            const updatedBoard = prev.map(e => {
                if(e && e.actualPet){
                    found = true;
                    return {
                        ...e,
                        score: e.score > finalScore? e.score : finalScore
                    };
                }
                return e
            })
            if(!found){
                updatedBoard.push({
                    name: updated.name,
                    score: updated.gameRecor,
                    actualPet: true,
                })
            }
            return updatedBoard.sort((a,b) => b.score - a.score);
        })


        setTimeout(() => setCharacter(updated), 0);

        setIsRunning(false);
        setGameOver(true);
    };

    const restartGame = () => {
        setScore(0);
        setBadCount(0);
        setIntervalTime(2000);
        idCounter.current = 0;
        setFoods([]);
        foodElsRef.current.clear();

        setGameOver(false);
        setIsRunning(true);
    };

    useEffect(() => {
        return () => {
            if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };
    }, []);

    return (
        <div className="h-screen bg-black relative overflow-hidden text-white">
            <img
                src="/pictures/game-background.png"
                alt="background"
                className='background'
            />
            <button onClick={() => {
                const finalScore = scoreRef.current;
                const updated = {
                    ...character,
                    money: (character.money || 0) + finalScore,
                };
                setCharacter(updated);
                back();
            }}
                className="toggleBakBtn"
            >livingroom</button>
            {foodsState.map(food => (
                <motion.span
                    id={`food-${food.id}`}
                    key={food.id}
                    style={{ position: 'absolute', left: food.x, top: 0, pointerEvents: 'none' }}
                    initial={{ y: -50 }}
                    animate={{ y: window.innerHeight - 120 }}
                    transition={{ duration: 3, ease: "linear" }}
                    onAnimationComplete={() => onFoodAnimationEnd(food.id)}
                    ref={(el) => {
                        if (el) foodElsRef.current.set(food.id, el);
                        else foodElsRef.current.delete(food.id);
                    }}
                    className="food"
                >
                    {food.emoji}
                </motion.span>
            ))}
            {character && (
                <img
                    src={`/pictures/character-${character.type}.png`}
                    alt="animal"
                    ref={characterRef}
                    className="animal"
                    style={{
                        position: "fixed",
                        left: cursorPos,
                        transform: "translateX(-50%)",
                        bottom: 20
                    }}
                />
            )}
            <div
                className="score">score: {score}</div>
            <div className="health">{"💗".repeat(3 - badCount)}</div>

            {gameOver && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        zIndex: 9999
                    }}
                >
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Game Over</h2>
                        <p>Your Score: {score}</p>
                        <p>Best Score: {character.gameRecor ? character.gameRecor : 0}</p>
                        <button
                            onClick={restartGame}
                            style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '1rem' }}
                        >
                            Again
                        </button>
                        <button
                            style={{ margin: "20px", marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '1rem' }}
                            onClick={() => back()}>Back</button>
                        <ul className='leaderBoardContainer'>
                            {leaderBoard.map((e, i) => {
                                if(i > 10) return
                                
                                return (
                                    <li
                                        className={`leadScore ${e.actualPet ? "itsMe" : ""}`}
                                        key={i}
                                    >
                                        <span className="leadRank">{i + 1}.</span>
                                        <span className='leadName'>{e.name}</span>
                                        <span className='leadScore'>{e.score}</span>
                                    </li>
                                )
                            })
                            
                            }
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HamGame;
