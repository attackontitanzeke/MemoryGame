import React, { useEffect, useState } from "react";

const MemoryGame = () => {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [won, setWon] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false); // State to track time up

  const initializeGame = () => {
    const totalCards = gridSize * gridSize;
    const pairCount = Math.floor(totalCards / 2);
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
    const shuffledCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({ id: index, number }));

    const timeLimits = {
      2: 10,
      3: 40,
      4: 60,
      5: 80,
      6: 100,
      7: 120,
      8: 150,
      9: 180,
      10: 240,
    };

    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setDisabled(false);
    setWon(false);
    setTimeLeft(timeLimits[gridSize]);
    setIsPaused(false);
    setIsTimeUp(false); // Reset time up state
  };

  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  useEffect(() => {
    if (timeLeft > 0 && !won && !isPaused) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !won) {
      setIsTimeUp(true); // Set time up state
    }
  }, [timeLeft, won, isPaused]);

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true);
    }
  }, [solved, cards]);

  const handleGridSize = (event) => {
    const size = parseInt(event.target.value, 10);
    if (size >= 2 && size <= 10) {
      setGridSize(size);
    }
  };

  const checkMatch = (secondId) => {
    const [firstId] = flipped;
    if (cards[firstId].number === cards[secondId].number) {
      setSolved([...solved, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  };

  const handleClick = (id) => {
    if (disabled || won || isPaused) return;
    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }
    if (flipped.length === 1) {
      setDisabled(true);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        checkMatch(id);
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);

  const isSolved = (id) => solved.includes(id);

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-400 p-4">
      <h1 className="text-3xl font-bold mb-3">Memory Game</h1>
      <div className="text-xl font-bold mb-4">Time Left: {timeLeft} sec</div>
      <div className="mb-4">
        <label htmlFor="gridSize" className="mr-2">
          Grid Size (2-10):
        </label>
        <input
          type="number"
          id="gridSize"
          min="2"
          max="10"
          value={gridSize}
          onChange={handleGridSize}
          className="border-2 border-gray-300 rounded px-2 py-1"
        />
      </div>

      <div
        className={`grid gap-2 mb-4`}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          width: `min(100%, ${gridSize * 5.5}rem)`,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleClick(card.id)}
            className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg 
            cursor-pointer transition-all duration-300 ${
              isFlipped(card.id)
                ? isSolved(card.id)
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-400"
            }`}
          >
            {isFlipped(card.id) ? card.number : "?"}
          </div>
        ))}
      </div>
      {won && (
        <div className="mt-4 text-4xl font-bold text-green-600 animate-bounce">
          You Won!
        </div>
      )}

      {/* Display Time Up Message */}
      {isTimeUp && !won && (
        <div className=" mt-2 text-3xl font-bold text-red-600 animate-bounce">
          Time's up!
        </div>
      )}

      <div className="flex gap-4 mt-4">
        <button
          onClick={initializeGame}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {won ? "Play Again" : "Reset"}
        </button>
        <button
          onClick={togglePause}
          className={`px-4 py-2 rounded ${
            isPaused
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-yellow-500 text-black hover:bg-yellow-600"
          }`}
        >
          {isPaused ? "Start" : "Pause"}
        </button>
      </div>
    </div>
  );
};

export default MemoryGame;
