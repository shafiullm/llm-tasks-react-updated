import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

function useTimer(initialTime) {
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  return {
    time,
    start: () => setIsActive(true),
    pause: () => setIsActive(false),
    reset: (newTime = initialTime) => {
      setTime(newTime);
      setIsActive(false);
    },
    isActive,
  };
}

function TimerCard({ time, onTimerEnd, lookAwayCount, cancelCount }) {
  const timer = useTimer(time);

  useEffect(() => {
    if (timer.time === 0) onTimerEnd();
  }, [timer.time, onTimerEnd]);

  return (
    <Card className="w-full max-w-sm mx-auto mt-10 shadow-lg">
      <CardHeader>
        <CardTitle>20-20-20 Rule Timer</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-5xl mb-4">
          {Math.floor(timer.time / 60)
            .toString()
            .padStart(2, "0")}
          :{(timer.time % 60).toString().padStart(2, "0")}
        </div>
        <div className="text-sm">
          Looked Away: {lookAwayCount}, Cancelled: {cancelCount}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={timer.isActive ? timer.pause : timer.start}
          className={timer.isActive ? "bg-black" : "bg-green-500"}
        >
          {timer.isActive ? "Pause" : "Start"}
        </Button>
        <Button onClick={timer.reset} className="ml-2 bg-red-500">
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [modalPhase, setModalPhase] = useState(0); // 0: initial, 1: 20 sec timer, 2: end
  const [lookAwayCount, setLookAwayCount] = useState(0);
  const [cancelCount, setCancelCount] = useState(0);

  const handleTimerEnd = () => {
    setShowModal(true);
    setModalPhase(0);
  };

  const lookAwayTimer = useTimer(20);

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        showModal ? "bg-black" : "bg-gradient-to-r from-gray-300 to-gray-500"
      }`}
    >
      <TimerCard
        time={20 * 60}
        onTimerEnd={handleTimerEnd}
        lookAwayCount={lookAwayCount}
        cancelCount={cancelCount}
      />
      <Modal open={showModal} onOpenChange={setShowModal}>
        {modalPhase === 0 && (
          <>
            <h2 className="text-lg font-bold mb-4">Look Away Now!</h2>
            <p>Look at least 20 feet away for 20 seconds.</p>
            <Button onClick={() => setModalPhase(1)}>Continue</Button>
            <Button
              onClick={() => {
                setCancelCount((c) => c + 1);
                setShowModal(false);
              }}
              className="ml-2 bg-red-500"
            >
              Cancel
            </Button>
          </>
        )}
        {modalPhase === 1 && (
          <>
            <h2 className="text-lg font-bold mb-4">Looking Away...</h2>
            <div>{lookAwayTimer.time}s</div>
            {lookAwayTimer.time === 0 && (
              <Button onClick={() => setModalPhase(2)}>Done</Button>
            )}
          </>
        )}
        {modalPhase === 2 && (
          <>
            <h2 className="text-lg font-bold mb-4">Done!</h2>
            <p>You can start working now.</p>
            <Button
              onClick={() => {
                setShowModal(false);
                setLookAwayCount((c) => c + 1);
              }}
            >
              Continue
            </Button>
          </>
        )}
      </Modal>
    </div>
  );
}
