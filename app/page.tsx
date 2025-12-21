"use client";

import { useState } from "react";
import { questions, travelerDescriptions, GLOBAL_VOUCHER_CODE } from "./data.js";

const BRAND_COLOR = "#f525bd";

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [currentStep, setCurrentStep] = useState(0);
  
  // Store the INDEX of the selected option for each question (e.g., { 0: 1, 1: 3 })
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  
  // View States
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  // Data States
  const [winner, setWinner] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState({ email: "", mobile: "" });
  const [bgOpacity, setBgOpacity] = useState(100);

  const question = questions[currentStep];

  // --- LOGIC: NAVIGATION ---
  
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentStep]: optionIndex,
    }));
  };

  const handleNext = () => {
    setBgOpacity(0); // Fade out effect
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // If it's the last question, go to Lead Form
        setShowLeadForm(true);
      }
      setBgOpacity(100);
    }, 300);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setBgOpacity(0);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setBgOpacity(100);
      }, 300);
    }
  };

  // --- LOGIC: SCORING (Calculated at the end) ---
  
  const calculateResult = () => {
    // 1. Tally up the scores based on selected answers
    const finalScores: Record<string, number> = {
      Explorer: 0, Planner: 0, Relaxer: 0, Adventure: 0, Culture: 0,
      Food: 0, Budget: 0, Luxury: 0, FreeSpirit: 0, Lifestyle: 0,
    };

    questions.forEach((q: any, qIndex: number) => {
      const selectedOptionIndex = selectedAnswers[qIndex];
      if (selectedOptionIndex !== undefined) {
        const optionScores = q.options[selectedOptionIndex].scores;
        // Add points
        Object.entries(optionScores).forEach(([type, points]) => {
          // @ts-ignore
          if (finalScores[type] !== undefined) finalScores[type] += points;
        });
      }
    });

    // 2. Find Winner
    const winningType = Object.keys(finalScores).reduce((a, b) =>
      finalScores[a] > finalScores[b] ? a : b
    );
    
    setWinner(winningType);
    setShowLeadForm(false);
    setShowResult(true);
  };

  // --- LOGIC: LEAD FORM SUBMIT ---
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo.email) return; // Simple validation
    calculateResult();
  };

  // --- BACKGROUND IMAGE LOGIC ---
  const getBackgroundImage = () => {
    if (showResult && winner) {
      // DYNAMIC RESULT BG: Looks for 'result-Explorer.jpg', 'result-Luxury.jpg' etc.
      // You must upload these images to /public/images/ later.
      return `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/images/result-${winner}.jpg')`;
    }
    
    // Default Question BG
    const currentBg = question?.bgImage || '/images/q1.jpeg';
    return `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${currentBg})`;
  };

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 text-white transition-all duration-500 ease-in-out bg-cover bg-center bg-no-repeat relative"
      style={{
        opacity: bgOpacity / 100,
        backgroundImage: getBackgroundImage(),
      }}
    >
      {/* --- HEADER (LOGO) --- */}
      <header className="absolute top-0 right-0 p-6 z-50">
        {/* Make sure logo.jpg is in /public/images/ */}
        <img 
          src="/images/logo.png" 
          alt="Logo" 
          className="w-20 md:w-28 h-auto drop-shadow-lg rounded-md"
        />
      </header>

      {/* --- VIEW 1: QUESTIONS --- */}
      {!showLeadForm && !showResult && (
        <div className="w-full max-w-4xl flex flex-col items-center text-center animate-fade-in-up">
          
          {/* Step Counter */}
          <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white/70 mb-6 py-2 px-5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            Question {currentStep + 1} / {questions.length}
          </span>

          {/* Question Text */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-10 drop-shadow-2xl leading-tight max-w-3xl mx-auto min-h-[120px] flex items-center justify-center">
            {question.question}
          </h1>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl mb-10">
            {question.options.map((option: any, index: number) => {
              const isSelected = selectedAnswers[currentStep] === index;
              const isLastAndOdd = index === question.options.length - 1 && question.options.length % 2 !== 0;

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`
                    group relative py-5 px-8 backdrop-blur-md border 
                    rounded-2xl font-bold text-lg transition-all duration-200 ease-out shadow-lg
                    ${isLastAndOdd ? "md:col-span-2 md:w-1/2 md:mx-auto" : "w-full"}
                    ${isSelected 
                      ? `bg-[#f525bd] border-[#f525bd] scale-[1.02] shadow-[0_0_20px_rgba(245,37,189,0.5)]` 
                      : "bg-white/10 border-white/20 hover:bg-white/20"}
                  `}
                >
                  {option.text}
                </button>
              );
            })}
          </div>

          {/* Navigation Buttons (Previous / Next) */}
          <div className="flex gap-4 w-full max-w-xs mx-auto">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-wider transition-all
                ${currentStep === 0 ? "opacity-0 pointer-events-none" : "bg-white/10 hover:bg-white/20"}`}
            >
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentStep] === undefined}
              className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-wider transition-all shadow-xl
                ${selectedAnswers[currentStep] === undefined 
                  ? "bg-gray-500/50 cursor-not-allowed text-white/50" 
                  : "bg-white text-[#f525bd] hover:scale-105"}`}
            >
              {currentStep === questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      )}


      {/* --- VIEW 2: LEAD CAPTURE FORM --- */}
      {showLeadForm && !showResult && (
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl text-center shadow-2xl animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">Almost There!</h2>
          <p className="text-white/80 mb-8 leading-relaxed">
            If you want to know what type of traveler you are, please enter your email address below.
          </p>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-left">
            <div>
              <label className="text-xs uppercase font-bold text-white/60 ml-1">Email Address <span className="text-[#f525bd]">*</span></label>
              <input 
                type="email" 
                required 
                className="w-full p-4 rounded-xl bg-white/80 text-black font-medium focus:outline-none focus:ring-4 focus:ring-[#f525bd]/50"
                placeholder="name@example.com"
                value={userInfo.email}
                onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
              />
            </div>

            <div>
              <label className="text-xs uppercase font-bold text-white/60 ml-1">Mobile Number (Optional)</label>
              <input 
                type="tel" 
                className="w-full p-4 rounded-xl bg-white/80 text-black font-medium focus:outline-none focus:ring-4 focus:ring-[#f525bd]/50"
                placeholder="+880..."
                value={userInfo.mobile}
                onChange={(e) => setUserInfo({...userInfo, mobile: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              className="mt-4 w-full py-4 bg-[#f525bd] hover:bg-[#d91ea5] text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(245,37,189,0.4)] transition-all hover:scale-[1.02]"
            >
              Reveal My Result
            </button>
          </form>
        </div>
      )}


      {/* --- VIEW 3: FINAL RESULT --- */}
      {showResult && (
        <div className="w-full max-w-md animate-scale-in flex flex-col items-center">
          <div className="bg-white text-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl w-full">
            
            {/* Header */}
            <div className="p-10 pt-12 text-center text-white relative overflow-hidden" style={{ backgroundColor: BRAND_COLOR }}>
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
               <h2 className="text-sm font-bold uppercase tracking-[0.2em] opacity-80 mb-2 relative z-10">Your Traveler Persona</h2>
               <h3 className="text-5xl font-black tracking-tighter relative z-10">{winner}</h3>
            </div>

            {/* Body */}
            <div className="p-8 text-center">
              <p className="text-lg text-gray-600 mb-8 font-medium leading-relaxed">
                {winner && travelerDescriptions[winner as keyof typeof travelerDescriptions]?.text}
              </p>

              {/* VOUCHER TICKET */}
              <div className="relative group cursor-pointer">
                  <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#f525bd] to-purple-600 opacity-70 blur transition duration-200 group-hover:opacity-100 animate-pulse"></div>
                  <div className="relative bg-white border-2 border-dashed border-gray-200 p-6 rounded-xl">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Reseller Voucher
                      </p>
                      <div className="text-4xl font-black text-[#f525bd] tracking-wide select-all">
                        {GLOBAL_VOUCHER_CODE}
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400">
                        Sent to: {userInfo.email}
                      </div>
                  </div>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="mt-10 py-3 px-8 rounded-full text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all uppercase tracking-wide"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}