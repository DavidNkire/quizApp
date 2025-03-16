import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

// ChoiceContainer using React.forwardRef
const ChoiceContainer = React.forwardRef(
  ({ prefix, choice, handleClick, isSelected, feedback }, ref) => {
    return (
      <div
        ref={ref}
        onClick={handleClick}
        className={`flex gap-5 mt-3 cursor-pointer hover:shadow-2xl hover:shadow-[#171717] hover:scale-[1.05] 
      transition-[150ms] text-[1.2rem] rounded-lg w-[90%] p-7 self-center
      ${isSelected === "correct" ? "bg-green-500 opacity-80" : ""}
      ${isSelected === "wrong" ? "bg-red-500 opacity-80" : ""}
      ${!isSelected ? "bg-blue-700" : ""}`}
      >
        <span>{prefix}</span>
        <h2>{choice}</h2>
        {feedback && <span className="ml-3 font-bold">{feedback}</span>}
      </div>
    );
  }
);

const Game = ({ score, setScore, categoryID }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const choiceRefs = useRef([]);
  const navigate = useNavigate();
  const progressRef = useRef(null);

  // Function to decode HTML entities in API responses
  const decodeHTML = (html) => {
    const parser = new DOMParser();
    return parser.parseFromString(html, "text/html").documentElement
      .textContent;
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
  }, [categoryID]);

  const currentQuestion = questions[currentQuestionIndex] || null;
  const MAX_QUESTIONS = questions.length || 1; // Prevent division by zero
  const progressPercentage = ((currentQuestionIndex + 1) / MAX_QUESTIONS) * 100;

  // Reset choice styles when moving to the next question
  useEffect(() => {
    setSelectedChoice(null);
    setFeedback(null);
    choiceRefs.current.forEach((ref) => {
      if (ref) {
        ref.classList.remove("bg-green-500", "bg-red-500", "opacity-80");
      }
    });
  }, [currentQuestionIndex]);

  // GSAP Animation for Progress Bar
  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${progressPercentage}%`,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  }, [progressPercentage]);

  useEffect(() => {
    if (animatedScore < score) {
      const interval = setInterval(() => {
        setAnimatedScore((prev) => (prev < score ? prev + 1 : prev));
      }, 10);
      return () => clearInterval(interval);
    }
  }, [score]);

  if (questions.length === 0)
    return (
      <div className="h-screen w-screen text-3xl text-white flex items-center justify-center flex-col gap-5">
        <p>Loading questions...</p>
        <div id="loader" className="loader"></div>
      </div>
    );

  const handleChoiceClick = (choice, index) => {
    if (selectedChoice !== null) return; // Prevent multiple selections

    const isCorrect = choice === currentQuestion.answer;
    setSelectedChoice(isCorrect ? "correct" : "wrong");
    setFeedback(isCorrect ? "✔ Correct" : "✖ Wrong");

    // Update Score
    if (isCorrect) setScore((prev) => prev + 100);

    setTimeout(() => {
      if (!isCorrect) {
        // Highlight correct answer
        const correctIndex = currentQuestion.choices.indexOf(
          currentQuestion.answer
        );
        choiceRefs.current[correctIndex]?.classList.add(
          "bg-green-500",
          "opacity-80"
        );
      }
    }, 1000);

    setTimeout(() => {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        navigate("/end"); // Redirect to results page (or handle end logic)
      }
    }, 2000);
  };

  return (
    <div className="text-white w-full md:py-0 py-10 min-h-screen flex items-center justify-center">
      <div className="md:w-[66%] w-full sm:px-0 px-5">
        <div id="hud" className="flex justify-between w-full">
          {/* Question Progress */}
          <div className="hud-item flex flex-col items-center justify-center">
            <p className="text-2xl text-center mb-3">{`Question ${
              currentQuestionIndex + 1
            } / ${MAX_QUESTIONS}`}</p>
            <div
              id="progressBar"
              className="md:w-[280px] w-[200px] border-green-500 md:h-[50px] h-[40px] rounded-full border-[5px]"
            >
              <div
                id="progressBarFull"
                ref={progressRef}
                className="bg-green-500 h-full rounded-full"
              ></div>
            </div>
          </div>

          {/* Score Display */}
          <div className="hud-item flex flex-col justify-center items-center">
            <p className="text-2xl">Score</p>
            <h1 className="md:text-7xl sm:text-5xl text-3xl">
              {animatedScore}
            </h1>
          </div>
        </div>

        {/* Question Display */}
        <h1 className="md:text-6xl sm:text-4xl text-3xl font-semibold my-10">
          {currentQuestion.question}
        </h1>

        {/* Choices */}
        {currentQuestion.choices.map((choice, index) => (
          <ChoiceContainer
            key={index}
            ref={(el) => (choiceRefs.current[index] = el)}
            prefix={String.fromCharCode(65 + index)} // A, B, C, D
            choice={choice}
            handleClick={() => handleChoiceClick(choice, index)}
            isSelected={
              selectedChoice === "correct" && choice === currentQuestion.answer
                ? "correct"
                : selectedChoice === "wrong" &&
                  choice === currentQuestion.answer
                ? "correct"
                : selectedChoice === "wrong" &&
                  choice !== currentQuestion.answer
                ? "wrong"
                : null
            }
            feedback={
              selectedChoice !== null &&
              selectedChoice === "wrong" &&
              choice === currentQuestion.answer
                ? "✔ Correct Answer"
                : null
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Game;
