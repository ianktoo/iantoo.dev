"use client";
import { useEffect, useState } from "react";
import { BlinkingCursor } from "./BlinkingCursor";

interface TypewriterTextProps {
  lines: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseMs?: number;
  loop?: boolean;
  className?: string;
  showCursor?: boolean;
}

export function TypewriterText({
  lines,
  speed = 50,
  deleteSpeed = 30,
  pauseMs = 2000,
  loop = true,
  className,
  showCursor = true,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (lines.length === 0) return;

    if (isPaused) {
      const timeout = setTimeout(() => {
        setIsPaused(false);
        if (loop || lineIndex < lines.length - 1) {
          setIsDeleting(true);
        }
      }, pauseMs);
      return () => clearTimeout(timeout);
    }

    const currentLine = lines[lineIndex];

    if (isDeleting) {
      if (charIndex > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(currentLine.slice(0, charIndex - 1));
          setCharIndex((c) => c - 1);
        }, deleteSpeed);
        return () => clearTimeout(timeout);
      } else {
        setIsDeleting(false);
        setLineIndex((i) => (i + 1) % lines.length);
      }
    } else {
      if (charIndex < currentLine.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentLine.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        }, speed);
        return () => clearTimeout(timeout);
      } else {
        setIsPaused(true);
      }
    }
  }, [charIndex, isDeleting, isPaused, lineIndex, lines, speed, deleteSpeed, pauseMs, loop]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && <BlinkingCursor />}
    </span>
  );
}
