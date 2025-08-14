import React, { useState } from "react";

const faqData = [
  { question: "What kind of developer are you?", answer: "A builder who loves crafting smooth, user-friendly apps that actually solve problems." },
  { question: "What inspires your coding style?", answer: "Clean logic, subtle details, and the thrill of seeing an idea come alive on screen." },
  { question: "Favorite tech to work with?", answer: "React, Node.js, MongoDB, and a little Docker magic to keep it all running anywhere." },
  { question: "Biggest strength as a developer?", answer: "Turning complex problems into simple, workable solutions." },
  { question: "Tell me about a project you loved working on.", answer: "A MERN school management app — watching it make school operations easier was priceless." },
  { question: "How do you handle bugs?", answer: "I go detective mode: recreate, isolate, debug, fix, and high-five myself." },
  { question: "How do you stay updated with tech?", answer: "Reading docs, experimenting with side projects, and exploring GitHub rabbit holes." },
  { question: "What's your design approach?", answer: "Minimal but functional — I like things that are easy on the eyes and easy to use." },
  { question: "What’s your process when starting a new project?", answer: "Understand the problem → map out the flow → build a strong backend → layer on a clean UI." },
  { question: "What’s your favorite part of the development process?", answer: "That moment when all the moving parts finally click together." },
  { question: "What makes you a strong teammate?", answer: "I’m collaborative, quick to share solutions, and I explain things without jargon overload." },
  { question: "How do you handle deadlines?", answer: "Break the project into chunks, track progress daily, and stay realistic about scope." },
  { question: "Dream project?", answer: "Something interactive, real-time, and impactful — like a live data dashboard or game-like app." },
  { question: "What’s your biggest coding flex?", answer: "Building full-stack apps from scratch, without copy-pasting random Stack Overflow code." },
  { question: "How do you approach learning something new?", answer: "Build something small with it right away — I learn best by doing." }
];

export default function FAQChat() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="max-w-lg mx-auto py-8 font-['SF Pro Text']">
      {faqData.map((item, i) => (
        <div key={i} className="mb-6">
          {/* Question bubble */}
          <div
            className="flex items-start justify-between cursor-pointer bg-black text-white rounded-2xl px-4 py-3 shadow-md"
            onClick={() => toggle(i)}
          >
            <span>{item.question}</span>
            <span className="ml-4 text-white font-bold">
              {openIndex === i ? "−" : "+"}
            </span>
          </div>

          {/* Answer bubble */}
          {openIndex === i && (
            <div className="bg-blue-500 text-white rounded-2xl px-4 py-3 mt-2 shadow-md">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
