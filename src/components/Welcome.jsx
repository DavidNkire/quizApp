import React from "react";
import { BiCrown } from "react-icons/bi";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="text-white flex flex-col items-center justify-center h-full">
      <h1 className="md:text-7xl sm:text-5xl text-4xl mb-10">Are you Ready?</h1>

      <Link to="/selectquiz">
        <button className="py-6 text-[1.5rem] px-10 bg-[rgb(15,20,220)] w-[18rem] mt-5 rounded-xl">
          Play
        </button>
      </Link>
      <Link to={"/highscores"}>
        <button className="py-6 text-black font-semibold text-[1.5rem] items-center justify-center gap-2 px-10 flex bg-[rgb(225,197,10)] w-[18rem] mt-5 rounded-lg">
          HighScore <BiCrown size={30} />
        </button>
      </Link>
    </div>
  );
};

export default Welcome;
