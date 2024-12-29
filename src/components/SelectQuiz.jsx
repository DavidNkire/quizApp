import React from "react";
import { Link } from "react-router-dom";

const SelectQuiz = ({ setCategoryID }) => {
  const topics = [
    { id: 19, name: "Mathematics" },
    { id: 17, name: "Science" },
    { id: 23, name: "History" },
    { id: 22, name: "Geography" },
    { id: 18, name: "Technology" },
    { id: 20, name: "Mythology" },
    { id: 25, name: "Art" },
    { id: 21, name: "Sports" },
    { id: 12, name: "Music" },
    { id: 9, name: "General Knowledge" },
  ];

  return (
    <div className="text-white flex overflow-hidden flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold mb-6">Select a Quiz Topic</h1>
      <div className="grid md:grid-cols-3 grid-cols-2 gap-2">
        {topics.map((topic) => (
          <Link to="/game" key={topic.id}>
            <div
              onClick={() => {
                setCategoryID(topic.id);
              }}
              className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white py-10 sm:px-5 px-2 sm:text-2xl text-[1rem] rounded-lg text-center"
            >
              {topic.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SelectQuiz;
