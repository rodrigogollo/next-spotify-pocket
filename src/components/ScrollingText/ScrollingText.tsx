"use client"
import "./ScrollingText.css";
import { useRef, useState, useEffect } from "react";

type ScrollingTextProps = {
  text: string;
  className: string
}

const ScrollingText = ({ text, className = '' }: ScrollingTextProps) => {
  const textRef = useRef(null);
  const [needsScroll, setNeedsScroll] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const parent = textRef.current.parentElement;
        if (parent) {
          const textWidth = textRef.current.firstChild.offsetWidth;
          const clientBounding = parent.getBoundingClientRect().width
          setNeedsScroll(textWidth > clientBounding);
        }
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => {
      window.removeEventListener('resize', checkOverflow);
      setNeedsScroll(false);
    }
  }, [text, needsScroll]);

  return (
    <div ref={textRef} className={`scrolling-text-container ${needsScroll ? "needs-scroll" : ""} ${className}`}>
      <span>{text}</span>
      {needsScroll && <span className="scroll-separator">•</span>}
      {needsScroll && <span className="scrolling-text">{text}</span>}
    </div>
  );
}

export default ScrollingText;
