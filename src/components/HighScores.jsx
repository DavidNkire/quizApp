import React, { useEffect, useState } from "react";
import { BiHome } from "react-icons/bi";
import { Link } from "react-router-dom";

const HighScores = () => {
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    // Fetch scores from localStorage
    const storedScores = localStorage.getItem("user-data-score");
    if (storedScores) {
      // Parse the stored scores and update the state
      const parsedScores = JSON.parse(storedScores);
      setHighScores(parsedScores); // Assuming one score for now, adjust logic for multiple
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-10">Highscores</h1>
        {highScores.length > 0 ? (
          <div>
            {highScores.map((user, index) => (
              <div className="my-2">
                <h1 className="text-3xl">{`${user.name} - ${user.score}`}</h1>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-2xl">No high scores available yet!</p>
        )}
        <Link
          to="/"
          className="py-6 sm:text-[1.5rem] text-[1.2rem] flex justify-center gap-5 items-center px-14 bg-[rgb(5,56,255)] sm:w-[20rem] w-[18rem] mt-8 rounded-lg"
          aria-label="Go Home"
        >
          Go Home <BiHome />
        </Link>
      </div>
    </div>
  );
};

export default HighScores;
