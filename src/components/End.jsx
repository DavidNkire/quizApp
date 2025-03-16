import React, { useState, useEffect } from "react";
import { BiHome } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";

const End = ({ score, setScore }) => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [rankMessage, setRankMessage] = useState("");

  useEffect(() => {
    // Rank messages based on score range
    if (score >= 800) setRankMessage("🏆 Legend! You're unstoppable!");
    else if (score >= 500) setRankMessage("🔥 Great job! Keep it up!");
    else if (score >= 200) setRankMessage("👏 Not bad! Try again to improve.");
    else setRankMessage("😢 Don't give up! Practice makes perfect.");
  }, [score]);

  const saveScore = () => {
    if (!userName.trim()) {
      alert("Please enter your name to save the score!");
      return;
    }

    const userScore = { name: userName, score };

    try {
      let storedScores =
        JSON.parse(localStorage.getItem("user-data-score")) || [];

      if (!Array.isArray(storedScores)) {
        storedScores = [];
      }

      storedScores.push(userScore);
      localStorage.setItem("user-data-score", JSON.stringify(storedScores));

      alert("Score saved successfully!");
      setScore(0);
      navigate("/");
    } catch (error) {
      console.error("Failed to save the score:", error);
      alert("An error occurred while saving the score. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center text-white animate-fadeIn">
      <h1 className="text-6xl font-bold text-yellow-400 drop-shadow-lg animate-pulse">
        Score: {score}
      </h1>

      <h2 className="font-bold text-2xl text-center py-6">{rankMessage}</h2>

      <h3 className="text-xl text-gray-200 py-4">
        Enter your name to save your score:
      </h3>
      <input
        type="text"
        placeholder="Your name..."
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="text-lg h-12 w-80 rounded-lg outline-none text-black px-5 py-2 shadow-lg border-2 border-blue-300 focus:ring-4 focus:ring-blue-500 transition"
      />

      <button
        onClick={saveScore}
        className="mt-5 py-4 px-12 text-lg font-bold bg-green-500 hover:bg-green-700 rounded-lg shadow-md transition-transform transform hover:scale-105"
      >
        Save Score
      </button>

      <button
        onClick={() => {
          setScore(0);
          navigate("/game");
        }}
        className="mt-4 py-4 px-12 text-lg font-bold bg-blue-500 hover:bg-blue-700 rounded-lg shadow-md transition-transform transform hover:scale-105"
      >
        Play Again
      </button>

      <Link
        onClick={() => setScore(0)}
        to="/"
        className="mt-4 flex items-center gap-3 py-4 px-12 text-lg font-bold bg-gray-800 hover:bg-gray-900 rounded-lg shadow-md transition-transform transform hover:scale-105"
      >
        <BiHome size={24} /> Go Home
      </Link>
    </div>
  );
};

export default End;
