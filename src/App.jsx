import React, { useState } from "react";
import Welcome from "./components/Welcome";
import { Route, Routes } from "react-router-dom";
import Game from "./components/Game";
import End from "./components/End";
import HighScores from "./components/HighScores";
import SelectQuiz from "./components/SelectQuiz";

const App = () => {
  const [score, setScore] = useState(0);
  const [categoryID, setCategoryID] = useState(0);
  return (
    <div className="bg-[#141414] h-screen overflow-hidden">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route
          path="/selectquiz"
          element={
            <SelectQuiz categoryID={categoryID} setCategoryID={setCategoryID} />
          }
        />
        <Route
          path="/game"
          element={
            <Game score={score} setScore={setScore} categoryID={categoryID} />
          }
        />
        <Route
          path="/end"
          element={<End score={score} setScore={setScore} />}
        />
        <Route path="/highscores" element={<HighScores />} />
      </Routes>
    </div>
  );
};

export default App;
