"use client";

import { useState } from "react";

interface TutorialStep {
  title: string;
  icon: string;
  content: string;
}

const STEPS: TutorialStep[] = [
  {
    title: "Chào mừng!",
    icon: "☁️",
    content: "Chào mừng đến Khu Vườn Trên Mây! Game nông trại trên mây.\n\nBạn sẽ trồng cây, chăm sóc và thu hoạch để kiếm vàng và kinh nghiệm.",
  },
  {
    title: "Đặt chậu",
    icon: "🏺",
    content: "1. Bấm nút 🏺 Đặt Chậu ở thanh công cụ dưới\n2. Chọn loại chậu từ menu hiện ra\n3. Click vào ô trống (+) trên tầng mây\n\nMỗi ô cần một chậu trước khi trồng cây.",
  },
  {
    title: "Trồng cây",
    icon: "🌱",
    content: "1. Bấm nút 🌱 Trồng\n2. Chọn hạt giống từ menu\n3. Click vào ô có chậu\n\nCây sẽ cần tưới nước 1 lần trước khi bắt đầu lớn.",
  },
  {
    title: "Tưới nước",
    icon: "💧",
    content: "1. Bấm nút 💧 Tưới\n2. Click vào cây hiện 💧 Khát nước\n\nSau khi tưới, cây sẽ tự lớn. Chỉ cần tưới 1 lần duy nhất.",
  },
  {
    title: "Sâu bọ",
    icon: "🐛",
    content: "Sâu bọ có thể xuất hiện khi cây đang lớn.\n\n• Cây vẫn tiếp tục lớn bình thường\n• Sâu tự mất khi cây chín\n• Hoặc bấm 🐛 Bắt Sâu để xử lý sớm\n• 🐒 Khỉ cũng tự bắt sâu nếu bật",
  },
  {
    title: "Thu hoạch",
    icon: "🌾",
    content: "Khi cây chín (hiện THU HOẠCH!):\n\n1. Bấm nút 🌾 Thu Hoạch\n2. Click vào cây chín\n\nNhận vàng 💰 và kinh nghiệm ⭐.",
  },
  {
    title: "Cửa hàng & Máy",
    icon: "🏠",
    content: "Bấm 🏠 Nhà để xuống tầng trệt:\n\n• 🏪 Cửa Hàng: mua hạt, chậu, phân, công cụ\n• 🔨 Nâng Cấp: đập 2 chậu + sâu → chậu tốt hơn\n• 🧃 Máy: chế tạo sản phẩm từ cây thu hoạch",
  },
  {
    title: "Sẵn sàng!",
    icon: "🎉",
    content: "Bạn đã biết cách chơi!\n\nMẹo:\n• Bấm ⚙️ để xem cài đặt\n• Bấm 🏆 để xem thành tích\n• Game tự lưu mỗi 30 giây\n• Khỉ 🐒 giúp tự động chăm sóc\n\nChúc bạn chơi vui! 🌸",
  },
];

export default function Tutorial() {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("kvtm_tutorial_done");
  });
  const [step, setStep] = useState(0);

  if (!show) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem("kvtm_tutorial_done", "1");
      setShow(false);
    } else {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("kvtm_tutorial_done", "1");
    setShow(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-neutral-800 rounded-2xl border border-neutral-600 w-[90%] max-w-[360px] overflow-hidden shadow-2xl">
        {/* Icon */}
        <div className="flex justify-center pt-6 pb-2">
          <span className="text-5xl">{current.icon}</span>
        </div>

        {/* Content */}
        <div className="px-5 pb-2 text-center">
          <h2 className="text-lg font-bold text-white mb-2">{current.title}</h2>
          <p className="text-[12px] text-neutral-300 whitespace-pre-line leading-relaxed">
            {current.content}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 py-3">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === step ? "bg-blue-400 scale-125" : i < step ? "bg-blue-600" : "bg-neutral-600"
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 px-5 pb-5">
          <button
            onClick={handleSkip}
            className="flex-1 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-[12px] text-neutral-400 transition-all"
          >
            Bỏ qua
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-[12px] text-white font-medium transition-all"
          >
            {isLast ? "Bắt đầu chơi!" : "Tiếp →"}
          </button>
        </div>
      </div>
    </div>
  );
}
