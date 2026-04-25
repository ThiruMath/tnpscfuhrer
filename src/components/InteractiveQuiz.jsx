import React, { useState, useEffect } from 'react';

// Sample extracted questions (mocked due to API unavailability in current context)
const extractedQuestions = [
  {
    id: 1, part: "A", lang: "en",
    question: "Who was the first Governor-General of independent India?",
    options: ["Lord Mountbatten", "C. Rajagopalachari", "Lord Dalhousie", "Waren Hastings"],
    answer: 0, topic: "History", year: 2026, paper_code: "GRP2A"
  },
  {
    id: 2, part: "A", lang: "en",
    question: "The Article 370 of the Indian Constitution dealt with:",
    options: ["Special status to Jammu and Kashmir", "Panchayati Raj", "Election Commission", "Finance Commission"],
    answer: 0, topic: "Polity", year: 2026, paper_code: "GRP2A"
  },
  {
    id: 3, part: "B", lang: "en",
    question: "Match the following:\n1. Pulses - A. Vitamin C\n2. Citrus - B. Protein\n3. Sun - C. Vitamin D",
    options: ["1-B, 2-A, 3-C", "1-A, 2-B, 3-C", "1-C, 2-B, 3-A", "1-B, 2-C, 3-A"],
    answer: 0, topic: "Science", year: 2026, paper_code: "GRP2A"
  },
  {
    id: 4, part: "B", lang: "en",
    question: "Identify the incorrect statement regarding the Reserve Bank of India.",
    options: ["It prints currency notes", "It regulates commercial banks", "It manages the foreign exchange", "It provides direct loans to farmers"],
    answer: 3, topic: "Economy", year: 2026, paper_code: "GRP2A"
  },
  {
    id: 5, part: "B", lang: "en",
    question: "This question was disputed.",
    options: ["Option A", "Option B", "Option C", "Option D"],
    answer: -1, topic: "History", year: 2026, paper_code: "GRP2A"
  }
];

export default function InteractiveQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(150 * 60); // 150 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const q = extractedQuestions[currentQuestion];
  
  useEffect(() => {
    if (isSubmitted || timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, timeRemaining]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelect = (optionIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: optionIndex });
  };

  const calculateScore = () => {
    let score = 0;
    extractedQuestions.forEach((question, index) => {
      if (question.answer === -1) return; // Disputed
      if (selectedAnswers[index] === question.answer) score++;
    });
    return score;
  };

  if (isSubmitted) {
    const validQuestions = extractedQuestions.filter(q => q.answer !== -1).length;
    return (
      <div className="min-h-screen bg-gray-900 text-yellow-500 font-sans p-8 flex flex-col items-center">
        <div className="max-w-3xl w-full bg-gray-800 rounded-2xl shadow-2xl p-10 border border-yellow-600">
          <h1 className="text-4xl font-bold mb-4 text-center">Quiz Results</h1>
          <div className="flex justify-center items-center mb-8">
            <div className="w-48 h-48 rounded-full border-8 border-yellow-500 flex items-center justify-center text-5xl font-bold bg-gray-900">
              {calculateScore()} / {validQuestions}
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mb-6 border-b border-yellow-600 pb-2">Answer Review</h2>
          <div className="space-y-6">
            {extractedQuestions.map((question, i) => {
              const uAns = selectedAnswers[i];
              const cAns = question.answer;
              const isDisputed = cAns === -1;
              const isCorrect = uAns === cAns;
              
              return (
                <div key={i} className={`p-4 rounded-lg bg-gray-900 border ${isDisputed ? 'border-gray-500' : isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                  <p className="font-medium text-lg mb-2"><span className="text-yellow-600">{i+1}.</span> {question.question}</p>
                  
                  {isDisputed ? (
                    <div className="text-gray-400 italic">⚠️ TO BE PLACED BEFORE EXPERT COMMITTEE</div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 mt-3">
                      {question.options.map((opt, optIdx) => (
                        <div key={optIdx} className={`p-2 rounded ${
                          optIdx === cAns ? 'bg-green-900/40 border-green-500 text-green-400 border' :
                          optIdx === uAns ? 'bg-red-900/40 border-red-500 text-red-400 border' : 'bg-gray-800 text-gray-400'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}) {opt}
                          {optIdx === cAns && ' ✓'}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button 
            onClick={() => { setIsSubmitted(false); setSelectedAnswers({}); setTimeRemaining(150*60); setCurrentQuestion(0); }}
            className="mt-8 w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-colors text-xl"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 lg:p-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* Main Quiz Area */}
        <div className="flex-1 bg-gray-800 rounded-2xl shadow-xl border border-yellow-600/30 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gray-900 p-4 border-b border-yellow-600/30 flex justify-between items-center">
            <h2 className="text-xl font-bold text-yellow-500">TNPSC Group 2A (Part {q.part})</h2>
            <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full border border-yellow-600/50">
              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span className={`font-mono text-lg font-bold ${timeRemaining < 300 ? 'text-red-500 animate-pulse' : 'text-yellow-500'}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
          
          {/* Question */}
          <div className="p-8 flex-1">
            <div className="flex justify-between items-end mb-6">
              <span className="text-sm font-semibold tracking-wider text-yellow-600/80 uppercase">{q.topic} • {q.year}</span>
              <span className="text-lg font-bold bg-gray-900 text-yellow-500 px-3 py-1 rounded-lg">Q {currentQuestion + 1}</span>
            </div>
            
            <h3 className="text-2xl font-medium leading-relaxed mb-8 whitespace-pre-wrap">
              {q.question}
            </h3>
            
            <div className="space-y-4">
              {q.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQuestion] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 group ${
                      isSelected 
                        ? 'border-yellow-500 bg-yellow-500/10' 
                        : 'border-gray-700 bg-gray-900/50 hover:border-yellow-600/50 hover:bg-gray-800'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex justify-center items-center font-bold font-mono transition-colors ${
                      isSelected ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 text-gray-400 group-hover:text-yellow-500'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className={`text-lg ${isSelected ? 'text-yellow-100 font-medium' : 'text-gray-300'}`}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Footer Controls */}
          <div className="bg-gray-900 p-4 border-t border-yellow-600/30 flex justify-between items-center">
            <button 
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-3 rounded-lg font-semibold bg-gray-800 hover:bg-gray-700 text-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentQuestion(Math.min(extractedQuestions.length - 1, currentQuestion + 1))}
              disabled={currentQuestion === extractedQuestions.length - 1}
              className="px-6 py-3 rounded-lg font-semibold bg-gray-800 hover:bg-gray-700 text-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
        
        {/* Navigator Sidebar */}
        <div className="w-full lg:w-80 bg-gray-800 rounded-2xl shadow-xl border border-yellow-600/30 p-6 flex flex-col">
          <h3 className="text-xl font-bold text-yellow-500 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Question Navigator
          </h3>
          
          <div className="grid grid-cols-5 gap-3 flex-1 content-start overflow-y-auto pr-2 pb-4">
            {extractedQuestions.map((_, idx) => {
              const isAnswered = selectedAnswers[idx] !== undefined;
              const isCurrent = currentQuestion === idx;
              
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-full aspect-square rounded-lg font-bold flex items-center justify-center transition-all ${
                    isCurrent 
                      ? 'ring-2 ring-white bg-yellow-500 text-gray-900 shadow-[0_0_15px_rgba(234,179,8,0.5)]' 
                      : isAnswered
                        ? 'bg-yellow-600/20 border border-yellow-500/50 text-yellow-400'
                        : 'bg-gray-900 border border-gray-700 text-gray-500 hover:border-yellow-600/50'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          
          <div className="mt-6 pt-6 border-t border-yellow-600/30">
            <button 
              onClick={() => setIsSubmitted(true)}
              className="w-full py-4 rounded-xl font-bold bg-yellow-600 hover:bg-yellow-500 text-gray-900 shadow-lg shadow-yellow-600/20 transition-all uppercase tracking-widest text-lg"
            >
              Submit Quiz
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
