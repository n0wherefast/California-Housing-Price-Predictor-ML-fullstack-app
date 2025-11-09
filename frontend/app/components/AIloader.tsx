import { useState,useEffect } from "react";
export default function AILoader() {


    const emojis = ["🤖", "🧠", "⚙️", "💡"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % emojis.length);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center text-3xl transition-all duration-300  animate-glow">
      {emojis[index]}
    </div>
  );
}
