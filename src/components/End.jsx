import React, { useState } from "react";
import { BiHome } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";

const End = ({ score, setScore }) => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const saveScore = () => {
    if (!userName.trim()) {
      alert("Please enter your name to save the score!");
      return;
    }

    const userScore = {
      name: userName,
      score: score,
    };

    try {
      // Attempt to parse stored scores or reset to an empty array if invalid
      let storedScores = JSON.parse(localStorage.getItem("user-data-score"));

      if (!Array.isArray(storedScores)) {
        console.warn(
          "Stored scores are not a valid array. Resetting to an empty array."
        );
        storedScores = [];
      }

      // Add the new score and save it back to localStorage
      const updatedScores = [...storedScores, userScore];
      localStorage.setItem("user-data-score", JSON.stringify(updatedScores));

      alert("Score saved successfully!");
      setScore(0); // Reset score after saving
      navigate("/"); // Redirect to home
    } catch (error) {
      console.error("Failed to save the score:", error);
      alert("An error occurred while saving the score. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center text-white">
      <h1 className="sm:text-6xl font-bold text-5xl">{`Score: ${score}`}</h1>
      <h2 className="font-bold sm:text-3xl text-2xl text-center py-10">
        Enter your name below to <br /> save your score!
      </h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="sm:text-[1.4rem] text-[1.2rem] sm:h-[65px] sm:w-[320px] h-[50px] w-[290px] outline-none text-black px-5 py-2"
        aria-label="Enter your name"
      />
      <button
        onClick={saveScore}
        className="py-6 sm:text-[1.5rem] text-[1.2rem] px-14 bg-[rgb(0,56,238)] sm:w-[20rem] w-[18rem] mt-5 rounded-lg"
        aria-label="Save Score"
      >
        Save
      </button>
      <button
        onClick={() => {
          navigate("/game");
          setScore(0); // Reset score before starting a new game
        }}
        className="py-6 sm:text-[1.5rem] text-[1.2rem] px-14 bg-[rgb(5,56,255)] sm:w-[20rem] w-[18rem] mt-5 rounded-lg"
        aria-label="Play Again"
      >
        Play Again
      </button>
      <Link
        to="/"
        className="py-6 sm:text-[1.5rem] text-[1.2rem] flex justify-center gap-5 items-center px-14 bg-[rgb(5,56,255)] sm:w-[20rem] w-[18rem] mt-5 rounded-lg"
        aria-label="Go Home"
      >
        Go Home <BiHome />
      </Link>
    </div>
  );
};

export default End;
