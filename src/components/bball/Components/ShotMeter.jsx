import React, { useState, useEffect, useRef } from 'react';

const BLUE   = "#00A4FF"
const GREEN  = "#5CE5A1"
const RED    = "#DC2342"
const YELLOW = "#F8CB45"

const redTheshold = 50
const yellowTheshold = 60
const greenTheshold = 75
const maxThreshold = 80

const ShotMeter = ({ ballRef }) => {
  const [isPressing, setIsPressing] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [timeoutReset, setTimeoutReset] = useState(0);
  const [color, setColor] = useState(BLUE);
  const intervalRef = useRef(null);


  // Start filling the meter
  useEffect(() => {
    if (isPressing) {
      intervalRef.current = setInterval(() => {
        setPercentage(prev => (prev < 100 ? prev + 1 : 100));
      }, 10); // Adjust speed as necessary
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      handleRelease();
    }

    return () => clearInterval(intervalRef.current);
  }, [isPressing]);

  // Handle the meter release and shoot logic
  const handleRelease = () => {
    ballRef.current.shoot(percentage / 100); // Adjust the force magnitude as needed

    if (percentage < redTheshold) {
      reset()
    } else {
      if (percentage > yellowTheshold && percentage <= greenTheshold) {
        setColor(YELLOW)
      } else if (percentage > greenTheshold && percentage <= maxThreshold) {
        setColor(GREEN)
      } else {
        setColor(RED)
      }

      const timeout = setTimeout(() => {
        reset()
      }, 1000)
      setTimeoutReset(timeout)
    }
  };

  const reset = () => {
      setColor(BLUE)
      setPercentage(0)
  }

  // Handle mouse down event to start the meter
  const handleMouseDown = () => {
    reset()
    ballRef.current.reset()
    clearTimeout(timeoutReset)
    setIsPressing(true);
  };

  // Handle mouse up event to stop the meter
  const handleMouseUp = () => {
    setIsPressing(false);
  };

return (
  <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }}
  >
    <div
      className="shot-meter"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      style={{
        background: `conic-gradient(
          ${color} ${percentage * 3.6}deg,
          #ECEEE9 ${percentage * 3.6}deg 100%)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontWeight: 'bold',
          fontSize: '16px',
          pointerEvents: 'none', // Ensure the text doesn't block clicks
        }}
      >
        {Math.round(percentage)}%
      </div>
    </div>
  </div>
);
};

export default ShotMeter;
