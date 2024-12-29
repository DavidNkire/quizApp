import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ChoiceContainer with React.forwardRef
const ChoiceContainer = React.forwardRef(
  ({ prefix, choice, handleClick }, ref) => {
    return (
      <div
        ref={ref}
        onClick={handleClick}
        className="flex gap-5 mt-3 cursor-pointer hover:shadow-2xl hover:shadow-[#171717] hover:scale-[1.05] transition-[150ms] text-[1.2rem] rounded-lg bg-blue-700 w-[90%] p-7 self-center        "
      >
        <span>{prefix}</span>
        <h2>{choice}</h2>
      </div>
    );
  }
);

const Game = ({ score, setScore, categoryID }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const choiceRefs = useRef([]); // Use useRef for refs
  const navigate = useNavigate();

  const decodeHTML = (html) => {
    const parser = new DOMParser();
    const decodedString = parser.parseFromString(html, "text/html")
      .documentElement.textContent;
    return decodedString;
  };

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `https://opentdb.com/api.php?amount=10&category=${categoryID}&type=multiple`
        );
        const data = await response.json();
        const formattedQuestions = data.results.map((item) => ({
          question: decodeHTML(item.question),
          choices: [
            ...item.incorrect_answers.map((ans) => decodeHTML(ans)),
            decodeHTML(item.correct_answer),
          ].sort(() => Math.random() - 0.5),
          answer: decodeHTML(item.correct_answer),
        }));
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  if (questions.length === 0)
    return (
      <div className="h-screen w-screen text-3xl text-white flex items-center justify-center flex-col gap-5">
        <p>Loading questions...</p>

        <div id="loader" className="loader"></div>
      </div>
    );

  const currentQuestion = questions[currentQuestionIndex];
  const MAX_QUESTIONS = questions.length;
  const progressPercentage = ((currentQuestionIndex + 1) / MAX_QUESTIONS) * 100;

  const handleChoiceClick = (choice, index) => {
    const isCorrect = choice === currentQuestion.answer;
    const updatedScore = score + (isCorrect ? 100 : 0);

    if (choiceRefs.current[index]) {
      const backgroundColorClass = isCorrect ? "bg-green-500" : "bg-red-500";
      choiceRefs.current[index].classList.add(backgroundColorClass);

      setTimeout(() => {
        choiceRefs.current[index].classList.remove(
          "bg-green-500",
          "bg-red-500"
        );
      }, 300);
    }

    setScore(updatedScore);

    if (currentQuestionIndex + 1 >= MAX_QUESTIONS) {
      navigate("/end");
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
  };

  return (
    <div className="text-white w-full h-full flex items-center justify-center">
      <div className="md:w-[60%] w-full sm:px-0 px-5">
        <div id="hud" className="flex justify-between w-full">
          <div className="hud-item flex flex-col items-center justify-center">
            <p className="text-2xl text-center mb-3">{`Question ${
              currentQuestionIndex + 1
            } / ${MAX_QUESTIONS}`}</p>
            <div
              id="progressBar"
              className="md:w-[280px] w-[200px] border-green-500  md:h-[50px] h-[40px] rounded-full border-[5px]"
            >
              <div
                id="progressBarFull"
                style={{ width: `${progressPercentage}%` }}
                className="bg-green-500 h-full rounded-full"
              ></div>
            </div>
          </div>
          <div className="hud-item flex flex-col justify-center items-center">
            <p className="text-2xl">Score</p>
            <h1 className="md:text-7xl sm:text-5xl text-3xl">{score}</h1>
          </div>
        </div>

        <h1 className="md:text-6xl sm:text-4xl text-3xl font-semibold my-10">
          {currentQuestion.question}
        </h1>

        {currentQuestion.choices.map((choice, index) => (
          <ChoiceContainer
            key={index}
            ref={(el) => (choiceRefs.current[index] = el)}
            prefix={String.fromCharCode(65 + index)} // A, B, C, D
            choice={choice}
            handleClick={() => handleChoiceClick(choice, index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Game;
