import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";

const TimerCard = ({ time, onStart, onPause, onReset, isRunning }) => {
  return (
    <Card
      className={`w-full max-w-sm mx-auto my-10 ${
        isRunning ? "bg-black text-white" : "bg-white shadow-lg"
      }`}
    >
      <CardHeader>
        <CardTitle>20-20-20 Rule Timer</CardTitle>
      </CardHeader>
      <CardContent className="text-center text-5xl">{time}</CardContent>
      <CardFooter>
        <Button
          onClick={isRunning ? onPause : onStart}
          className={`mr-2 ${isRunning ? "bg-black" : "bg-green-500"}`}
        >
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button onClick={onReset} className="bg-red-500">
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
};

const LookAwayModal = ({ onContinue, onCancel, time, isOpen }) => {
  return (
    <Modal open={isOpen} onOpenChange={onCancel}>
      <ModalContent>
        <ModalHeader>Look Away!</ModalHeader>
        <ModalBody>
          {time > 0
            ? `Look at least 20 feet away for ${time} seconds.`
            : "You can start working now."}
        </ModalBody>
        <ModalFooter>
          {time > 0 ? (
            <>
              <Button onClick={onContinue}>Continue</Button>
              <Button onClick={onCancel} variant="secondary">
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={onContinue}>Continue</Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default function App() {
  const [time, setTime] = useState(20 * 60); // 20 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isLookAway, setIsLookAway] = useState(false);
  const [lookAwayCount, setLookAwayCount] = useState(0);
  const [cancelCount, setCancelCount] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      clearInterval(intervalRef.current);
      setIsLookAway(true);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, time]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setTime(20 * 60);
    setIsRunning(false);
    setIsLookAway(false);
  };

  const handleLookAway = () => {
    if (time === 0) {
      setTime(20); // Reset for 20 seconds look away
      setLookAwayCount((prev) => prev + 1);
    }
  };

  const handleCancel = () => {
    setCancelCount((prev) => prev + 1);
    setIsLookAway(false);
    setTime(20 * 60);
    setIsRunning(true);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        isRunning ? "bg-black" : "bg-gradient-to-r from-gray-300 to-gray-500"
      }`}
    >
      <TimerCard
        time={
          isLookAway
            ? time
            : Math.floor(time / 60) +
              ":" +
              (time % 60).toString().padStart(2, "0")
        }
        onStart={startTimer}
        onPause={pauseTimer}
        onReset={resetTimer}
        isRunning={isRunning && !isLookAway}
      />
      <div className="mt-4 text-center">
        <p>Looked Away: {lookAwayCount} times</p>
        <p>Cancelled Look Away: {cancelCount} times</p>
      </div>
      <LookAwayModal
        onContinue={isLookAway ? resetTimer : handleLookAway}
        onCancel={handleCancel}
        time={isLookAway ? time : 0}
        isOpen={isLookAway || time === 0}
      />
    </div>
  );
}
