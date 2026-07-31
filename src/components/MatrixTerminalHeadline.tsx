import { useEffect, useState } from "react";

interface MatrixTerminalHeadlineProps {
  line1: string;
  line2: string;
  line1ClassName?: string;
  line2ClassName?: string;
  cursorColor?: string;
  speed?: number;
  headlineClassName?: string;
}

const MATRIX_NUMS = "01234567890123456789";

function getDisplayLine(line: string, typedLength: number, scrambleChar: string) {
  if (typedLength === 0) return "";
  if (typedLength >= line.length) return line;
  return line.slice(0, typedLength - 1) + scrambleChar;
}

export function MatrixTerminalHeadline({
  line1,
  line2,
  line1ClassName = "text-white",
  line2ClassName = "text-lime-400",
  cursorColor = "text-lime-400",
  speed = 30,
  headlineClassName = "text-4xl sm:text-6xl font-black tracking-tight leading-[1.08]",
}: MatrixTerminalHeadlineProps) {
  const [typedLength1, setTypedLength1] = useState(0);
  const [typedLength2, setTypedLength2] = useState(0);
  const [scrambleChar1, setScrambleChar1] = useState("");
  const [scrambleChar2, setScrambleChar2] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blinking terminal block cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 450);
    return () => clearInterval(interval);
  }, []);

  // Reset when text props change
  useEffect(() => {
    setTypedLength1(0);
    setTypedLength2(0);
  }, [line1, line2]);

  // Character typing sequence with matrix numbers scramble
  useEffect(() => {
    if (typedLength1 < line1.length) {
      const timeout = setTimeout(() => {
        setTypedLength1((prev) => prev + 1);
        setScrambleChar1(MATRIX_NUMS[Math.floor(Math.random() * MATRIX_NUMS.length)]);
      }, speed + (Math.random() * 16 - 8));
      return () => clearTimeout(timeout);
    } else if (typedLength2 < line2.length) {
      const timeout = setTimeout(() => {
        setTypedLength2((prev) => prev + 1);
        setScrambleChar2(MATRIX_NUMS[Math.floor(Math.random() * MATRIX_NUMS.length)]);
      }, speed + (Math.random() * 16 - 8));
      return () => clearTimeout(timeout);
    }
  }, [typedLength1, typedLength2, line1, line2, speed]);

  const isLine1Active = typedLength1 < line1.length;
  const isLine2Active = typedLength1 >= line1.length;

  return (
    <h1 className={headlineClassName}>
      <span className="relative inline-block">
        <span className={line1ClassName}>{getDisplayLine(line1, typedLength1, scrambleChar1)}</span>
        {isLine1Active && (
          <span className={`inline-block ml-1 font-mono font-bold ${cursorColor}`}>
            {cursorVisible ? "█" : "\u00A0"}
          </span>
        )}
      </span>
      <br />
      <span className="relative inline-block">
        <span className={line2ClassName}>{getDisplayLine(line2, typedLength2, scrambleChar2)}</span>
        {isLine2Active && (
          <span className={`inline-block ml-1 font-mono font-bold ${cursorColor}`}>
            {cursorVisible ? "█" : "\u00A0"}
          </span>
        )}
      </span>
    </h1>
  );
}
