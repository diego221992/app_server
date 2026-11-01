import * as React from "react"
import { useEffect, useState } from "react"

export default function SvgBlocksScale(props) {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 5);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const getBarStyle = (index) => {
    const isActive = animationPhase === index;
    return {
      transform: isActive ? 'scaleY(1.8)' : 'scaleY(1)',
      transformOrigin: 'center',
      transition: 'transform 0.3s ease-in-out'
    };
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="hsl(228, 97%, 42%)"
      viewBox="0 0 24 24"
      {...props}
    >
      <path 
        d="M1 6h2.8v12H1z"
        style={getBarStyle(0)}
      />
      <path 
        d="M5.8 6h2.8v12H5.8z"
        style={getBarStyle(1)}
      />
      <path 
        d="M10.6 6h2.8v12h-2.8z"
        style={getBarStyle(2)}
      />
      <path 
        d="M15.4 6h2.8v12h-2.8z"
        style={getBarStyle(3)}
      />
      <path 
        d="M20.2 6H23v12h-2.8z"
        style={getBarStyle(4)}
      />
    </svg>
  )
}