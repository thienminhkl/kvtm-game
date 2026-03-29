"use client";

import { useState, useCallback } from "react";

interface TutorialStep {
  title: string;
  icon: string;
  content: string;
}

const STEPS: TutorialStep[] = [
  { title: "Chào mừng!", icon: "☁️", content: "Chào mừng đến Khu Vườn Trên Mây!\n\nBạn sẽ trồng cây, chăm sóc và thu hoạch." },
  { title: "Đặt chậu", icon: "🏺", content: "1. Bấm 🏺 Đặt Chậu\n2. Chọn chậu từ menu\n3. Click ô trống trên tầng mây" },
  { title: "Trồng cây", icon: "🌱", content: "1. Bấm 🌱 Trồng\n2. Chọn hạt giống\n3. Click vào ô có chậu" },
  { title: "Tưới nước", icon: "💧", content: "1. Bấm 💧 Tưới\n2. Click cây khát nước\nChỉ cần tưới 1 lần!" },
  { title: "Thu hoạch", icon: "🌾", content: "Khi cây chín:\n1. Bấm 🌾 Thu Hoạch\n2. Click cây chín\nNhận vàng + EXP!" },
  { title: "Sẵn sàng!", icon: "🎉", content: "• ⚙️ Cài đặt  • 🏆 Thành tích\n• Game tự lưu mỗi 30s\n• 🐒 Khỉ giúp tự động chăm sóc\nChúc bạn chơi vui! 🌸" },
];

export default function Tutorial() {
  const [show, setShow] = useState(true);
  const [step, setStep] = useState(0);

  const handleNext = useCallback(() => {
    if (step >= STEPS.length - 1) {
      setShow(false);
    } else {
      setStep(s => s + 1);
    }
  }, [step]);

  const handleSkip = useCallback(() => {
    setShow(false);
  }, []);

  if (!show) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-neutral-800 rounded-2xl border border-neutral-600 w-[90%] max-w-[340px] overflow-hidden shadow-2xl">
        <div className="flex justify-center pt-5 pb-1">
          <span className="text-4xl">{current.icon}</span>
        </div>
        <div className="px-4 pb-1 text-center">
          <h2 className="text-base font-bold text-white mb-1">{current.title}</h2>
          <p className="text-[11px] text-neutral-300 whitespace-pre-line leading-relaxed">{current.content}</p>
        </div>
        <div className="flex justify-center gap-1.5 py-2">
          {STEPS.map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === step ? "bg-blue-400" : i < step ? "bg-blue-600" : "bg-neutral-600"}`} />
          ))}
        </div>
        <div className="flex gap-2 px-4 pb-4">
          <button onClick={handleSkip} className="flex-1 py-1.5 rounded-lg bg-neutral-700 text-[11px] text-neutral-400">Bỏ qua</button>
          <button onClick={handleNext} className="flex-1 py-1.5 rounded-lg bg-blue-600 text-[11px] text-white font-medium">{isLast ? "Bắt đầu!" : "Tiếp →"}</button>
        </div>
      </div>
    </div>
  );
}
