import React from "react";

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all relative overflow-hidden">
      {/* Circles Animation */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="relative w-full h-full">
          {/* Circle 1 (Lightest Green) */}
          <div className="absolute top-14 left-8 w-14 h-14 bg-[#d1fae5] rounded-full animate-bounce"></div>
          {/* Circle 2 (Lighter Green) */}
          <div className="absolute top-20 right-12 w-20 h-20 bg-[#a7f3d0] rounded-full animate-bounce delay-150"></div>
          {/* Circle 3 (Light Green) */}
          <div className="absolute top-1/4 left-1/3 w-12 h-12 bg-[#6ee7b7] rounded-full animate-bounce delay-300"></div>
          {/* Circle 4 (Medium Green) */}
          <div className="absolute bottom-14 left-14 w-24 h-24 bg-[#34d399] rounded-full animate-bounce delay-450"></div>
          {/* Circle 5 (Bright Green) */}
          <div className="absolute bottom-20 right-20 w-16 h-16 bg-[#10b981] rounded-full animate-bounce delay-600"></div>
          {/* Circle 6 (Darker Green) */}
          <div className="absolute top-28 right-16 w-18 h-18 bg-[#059669] rounded-full animate-bounce delay-750"></div>
          {/* Circle 7 (Dark Green) */}
          <div className="absolute top-1/2 right-12 w-22 h-22 bg-[#047857] rounded-full animate-bounce delay-1050"></div>
          {/* Circle 8 (Darkest Green) */}
          <div className="absolute top-12 left-1/4 w-8 h-8 bg-[#064e3b] rounded-full animate-bounce delay-1350"></div>
          {/* Circle 9 */}
          <div className="absolute bottom-1/3 left-20 w-16 h-16 bg-[#064e3b] rounded-full animate-bounce delay-1500"></div>
          {/* Circle 10 */}
          <div className="absolute bottom-14 right-1/2 w-12 h-12 bg-[#064e3b] rounded-full animate-bounce delay-1650"></div>
          {/* New Circle Above Text */}
          <div className="absolute top-[48%] left-[50%] transform -translate-x-1/2 -translate-y-full w-26 h-26 bg-[#064e3b] rounded-full animate-bounce delay-1800"></div>
        </div>
        <div></div>
      </div>

      {/* Text Section */}
      <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center z-10 relative">
        <h3 className="poppins-medium">
          Hi <span className="text-[#10b981]">!</span> Welcome to{" "}
          <span className="text-[#047857]">ChatVerse</span> Chat App{" "}
          <span className="text-[#064e3b]">.</span>
        </h3>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
