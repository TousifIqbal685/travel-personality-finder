"use client";

import { useState } from "react";
import localFont from "next/font/local";
import { supabase } from "./supabase"; 
import { questions, travelerDescriptions, GLOBAL_VOUCHER_CODE } from "./data.js";

// Configure Proxima Nova
const proxima = localFont({
  src: [
    {
      path: './fonts/ProximaNova-Regular.otf', 
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Proxima Nova Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/Proxima Nova Extrabold.otf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-proxima', 
});

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  
  // View States
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVoucherUnlocked, setIsVoucherUnlocked] = useState(false); // NEW STATE
  
  // Data States
  const [winner, setWinner] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState({ email: "", mobile: "" });
  const [bgOpacity, setBgOpacity] = useState(100);

  const question = questions[currentStep];

  // --- LOGIC: SCORING ---
  // We moved this out to a helper so we can call it anytime
  const calculateWinner = () => {
    const finalScores: any = {
      Explorer: 0, Planner: 0, Relaxer: 0, Adventure: 0, Culture: 0,
      Food: 0, Budget: 0, Luxury: 0, FreeSpirit: 0, Lifestyle: 0,
    };

    questions.forEach((q: any, qIndex: number) => {
      const selectedOptionIndex = selectedAnswers[qIndex];
      if (selectedOptionIndex !== undefined) {
        const optionScores = q.options[selectedOptionIndex].scores;
        Object.entries(optionScores).forEach(([type, points]) => {
          if (finalScores[type] !== undefined) finalScores[type] += points;
        });
      }
    });

    return Object.keys(finalScores).reduce((a, b) =>
      finalScores[a] > finalScores[b] ? a : b
    );
  };

  // --- LOGIC: NAVIGATION ---
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentStep]: optionIndex,
    }));
  };

  const handleNext = () => {
    setBgOpacity(0); 
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // --- NEW LOGIC: SHOW RESULT IMMEDIATELY ---
        const winningType = calculateWinner();
        setWinner(winningType);
        setShowResult(true);
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

  // --- LOGIC: UNLOCK VOUCHER (SUBMIT TO DB) ---
  const handleUnlockVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo.email) return;
    
    setIsSubmitting(true);

    // Prepare Detailed Answers for Database
    const userAnswersList = questions.map((q: any, index: number) => {
      const selectedIdx = selectedAnswers[index];
      const answerText = selectedIdx !== undefined ? q.options[selectedIdx].text : "Skipped";
      return { question: q.question, answer: answerText };
    });

    try {
      const { error } = await supabase
        .from('leads')
        .insert([
          { 
            email: userInfo.email, 
            mobile: userInfo.mobile,
            result: winner, // Winner is already calculated
            details: userAnswersList
          },
        ]);

      if (error) console.error('Error inserting data:', error);
    } catch (err) {
      console.error('Unexpected error:', err);
    }

    setIsSubmitting(false);
    setIsVoucherUnlocked(true); // REVEAL THE CODE
  };

  const getBackgroundImage = () => {
    if (showResult && winner) {
      return `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/result-${winner}.jpg')`;
    }
    const currentBg = question?.bgImage || '/images/q1.jpeg';
    return `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${currentBg})`; 
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-4 md:p-8 text-white transition-all duration-500 ease-in-out bg-cover bg-center bg-no-repeat relative ${proxima.className}`}
      style={{
        opacity: bgOpacity / 100,
        backgroundImage: getBackgroundImage(),
      }}
    >
      {/* --- HEADER (LOGO) --- */}
      <header className="absolute top-0 right-0 p-6 z-50">
        <img 
          src="/images/logo.png"
          alt="Logo" 
          className="w-24 md:w-32 h-auto drop-shadow-xl rounded-lg hover:scale-105 transition-transform"
        />
      </header>

      {/* --- VIEW 1: QUESTIONS --- */}
      {!showResult && (
        <div className="w-full max-w-7xl flex flex-col items-center text-center animate-fade-in-up">
          
          <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white/70 mb-6 py-2 px-5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            Question {currentStep + 1} / {questions.length}
          </span>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-10 drop-shadow-2xl leading-tight w-full max-w-7xl mx-auto min-h-[120px] flex items-center justify-center">
            {question.question}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl mb-10">
            {question.options.map((option: any, index: number) => {
              const isSelected = selectedAnswers[currentStep] === index;
              const isLastAndOdd = index === question.options.length - 1 && question.options.length % 2 !== 0;

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`
                    group relative py-6 px-8 backdrop-blur-md border 
                    rounded-2xl font-bold text-lg md:text-xl transition-all duration-200 ease-out shadow-lg
                    ${isLastAndOdd ? "md:col-span-2 md:w-1/2 md:mx-auto" : "w-full"}
                    ${isSelected 
                      ? `bg-[#f525bd] border-[#f525bd] scale-[1.02] shadow-[0_0_20px_rgba(245,37,189,0.5)]` 
                      : "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40"}
                  `}
                >
                  {option.text}
                </button>
              );
            })}
          </div>

          <div className="flex gap-6 w-full max-w-md mx-auto justify-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`py-3 px-8 rounded-full font-bold uppercase text-sm tracking-wider transition-all backdrop-blur-md border border-white/30
                ${currentStep === 0 
                  ? "hidden" 
                  : "flex-1 bg-white/10 hover:bg-white/20 text-white" 
                }`}
            >
              Back
            </button>
            
            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentStep] === undefined}
              className={`flex-1 py-3 px-8 rounded-full font-bold uppercase text-sm tracking-wider transition-all shadow-xl border
                ${selectedAnswers[currentStep] === undefined 
                  ? "bg-gray-500/50 border-transparent cursor-not-allowed text-white/50" 
                  : "bg-white border-white text-[#f525bd] hover:scale-105"}`}
            >
              {currentStep === questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      )}

      {/* --- VIEW 2: FINAL RESULT (With Unlocked/Locked Voucher) --- */}
      {showResult && (
        <div className="w-full max-w-lg animate-scale-in flex flex-col items-center p-4 text-center">
            
            {/* 1. PERSONALITY RESULT (Always Visible) */}
            <div className="mb-8">
               <h2 className="text-sm md:text-base font-bold uppercase tracking-[0.3em] text-white mb-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                 Your Traveler Persona
               </h2>
               <h3 className="text-6xl md:text-7xl font-black tracking-tighter text-[#f525bd] drop-shadow-[0_4px_4px_rgba(0,0,0,1)]"
                   style={{ textShadow: '0 0 40px rgba(245, 37, 189, 0.5)' }}>
                 {winner && travelerDescriptions[winner as keyof typeof travelerDescriptions]?.title}
               </h3>
            </div>

            <p className="text-xl md:text-2xl text-white font-semibold leading-relaxed mb-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] max-w-md mx-auto">
              {winner && travelerDescriptions[winner as keyof typeof travelerDescriptions]?.text}
            </p>

            {/* 2. VOUCHER SECTION (Changes based on Unlock State) */}
            <div className="relative w-full max-w-sm mx-auto transition-transform duration-300 hover:scale-[1.01]">
                <div className="absolute -inset-1 rounded-2xl bg-[#f525bd] opacity-70 blur-lg animate-pulse"></div>
                
                <div className="relative bg-white border-4 border-white p-6 pb-8 rounded-xl shadow-2xl text-gray-800">
                    
                    {!isVoucherUnlocked ? (
                      // --- LOCKED STATE: FORM ---
                      <form onSubmit={handleUnlockVoucher} className="flex flex-col gap-3">
                        <p className="text-sm font-bold text-[#f525bd] uppercase tracking-widest mb-2">
                           Unlock Your BDT500 Voucher
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                          Enter your details below to reveal your exclusive coupon code.
                        </p>

                        <input 
                          type="email" 
                          required 
                          placeholder="Email Address"
                          className="w-full p-3 bg-gray-50 rounded-lg text-sm font-bold border border-gray-200 focus:outline-none focus:border-[#f525bd] text-gray-900 placeholder:text-gray-400"
                          value={userInfo.email}
                          onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                        />
                        <input 
                          type="tel" 
                          placeholder="Phone (Optional)"
                          className="w-full p-3 bg-gray-50 rounded-lg text-sm font-bold border border-gray-200 focus:outline-none focus:border-[#f525bd] text-gray-900 placeholder:text-gray-400"
                          value={userInfo.mobile}
                          onChange={(e) => setUserInfo({...userInfo, mobile: e.target.value})}
                        />

                        <button 
                          type="submit"
                          disabled={isSubmitting}
                          className="mt-2 w-full py-3 bg-[#f525bd] hover:bg-[#d91ea5] text-white font-black text-sm uppercase rounded-lg shadow-md transition-all disabled:opacity-70"
                        >
                          {isSubmitting ? "Unlocking..." : "Get Voucher Code"}
                        </button>
                      </form>
                    ) : (
                      // --- UNLOCKED STATE: CODE ---
                      <div className="animate-fade-in">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">
                          Welcome Coupon
                        </p>
                        
                        <div className="border-t-2 border-b-2 border-dashed border-gray-100 py-4 mb-2">
                          <div className="text-4xl md:text-5xl font-black text-[#f525bd] tracking-wide select-all drop-shadow-sm">
                            {GLOBAL_VOUCHER_CODE}
                          </div>
                        </div>

                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mb-2">
                            Valid from 5th Jan till 30th April 2026
                        </p>
                        
                        <a 
                          href="/terms.pdf" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="absolute bottom-3 right-4 text-[9px] font-bold text-[#f79b4c] hover:text-[#f5831f] underline transition-colors"
                        >
                          T&C
                        </a>
                      </div>
                    )}
                </div>
            </div>

            {isVoucherUnlocked && (
              <p className="mt-8 text-xs md:text-sm text-white/90 font-medium tracking-wide drop-shadow-md animate-pulse">
                 Take a screenshot of this to apply the voucher for your next buy on RYOKO! 
              </p>
            )}

            <button
              onClick={() => window.location.reload()}
              className="mt-12 py-3 px-10 rounded-full text-sm font-bold text-white border-2 border-white/50 hover:bg-white hover:text-[#f525bd] hover:border-white transition-all uppercase tracking-widest drop-shadow-lg"
            >
              Retake Quiz
            </button>

        </div>
      )}
    </main>
  );
}