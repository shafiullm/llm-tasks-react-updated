import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const CounterDisplay = ({ label, count }) => (
  <div className="flex flex-col items-center px-4">
    <span className="text-2xl font-bold">{count}</span>
    <span className="text-xs text-gray-600">{label}</span>
  </div>
);

const Timer = ({
  time,
  isRunning,
  onStart,
  onPause,
  onReset,
  lookAwayCount,
  cancelCount,
}) => (
  <Card className="w-full max-w-sm mx-auto">
    <CardHeader>
      <CardTitle className="text-center text-2xl font-bold">
        20-20-20 Rule Timer
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-center text-7xl font-bold mb-6">
        {formatTime(time)}
      </div>
      <div className="flex justify-center space-x-4">
        <Button
          onClick={isRunning ? onPause : onStart}
          className={`w-32 h-12 flex text-center items-center justify-center ${
            isRunning
              ? "bg-black hover:bg-gray-800"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button
          onClick={onReset}
          className="w-32 h-12 flex items-center justify-center bg-red-500 hover:bg-red-600"
        >
          Reset
        </Button>
      </div>
    </CardContent>
    <CardFooter className="flex justify-center items-center border-t pt-4">
      <CounterDisplay label="Look Aways" count={lookAwayCount} />
      <div className="h-10 border-l mx-2"></div>
      <CounterDisplay label="Cancels" count={cancelCount} />
    </CardFooter>
  </Card>
);

const Modal = ({
  isOpen,
  title,
  description,
  actionText,
  onAction,
  onCancel,
  showCancel,
}) => (
  <AlertDialog open={isOpen}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction
          onClick={onAction}
          className="w-full sm:w-auto h-12 flex items-center justify-center"
        >
          {actionText}
        </AlertDialogAction>
        {showCancel && (
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default function App() {
  const [mainTime, setMainTime] = useState(20 * 60);
  const [lookAwayTime, setLookAwayTime] = useState(20);
  const [isRunning, setIsRunning] = useState(false);
  const [showLookAwayModal, setShowLookAwayModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [currentTimer, setCurrentTimer] = useState("main");
  const [lookAwayCount, setLookAwayCount] = useState(0);
  const [cancelCount, setCancelCount] = useState(0);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        if (currentTimer === "main") {
          setMainTime((prevTime) => {
            if (prevTime <= 1) {
              setIsRunning(false);
              setShowLookAwayModal(true);
              return 20 * 60;
            }
            return prevTime - 1;
          });
        } else if (currentTimer === "lookAway") {
          setLookAwayTime((prevTime) => {
            if (prevTime <= 1) {
              setIsRunning(false);
              setShowCompletionModal(true);
              return 20;
            }
            return prevTime - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentTimer]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setMainTime(20 * 60);
  };

  const handleLookAwayStart = () => {
    setShowLookAwayModal(false);
    setCurrentTimer("lookAway");
    setIsRunning(true);
    setLookAwayCount((prev) => prev + 1);
  };

  const handleLookAwayCancel = () => {
    setShowLookAwayModal(false);
    setIsRunning(true);
    setCancelCount((prev) => prev + 1);
  };

  const handleCompletion = () => {
    setShowCompletionModal(false);
    setCurrentTimer("main");
    setMainTime(20 * 60);
    setLookAwayTime(20);
    setIsRunning(true);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        isRunning ? "bg-black" : "bg-gradient-to-br from-gray-200 to-gray-400"
      }`}
    >
      <div className="w-full max-w-md">
        {currentTimer === "main" ? (
          <Timer
            time={mainTime}
            isRunning={isRunning}
            onStart={handleStartPause}
            onPause={handleStartPause}
            onReset={handleReset}
            lookAwayCount={lookAwayCount}
            cancelCount={cancelCount}
          />
        ) : (
          <Card className="w-full max-w-sm mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                Look Away Timer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-7xl font-bold mb-4">
                {formatTime(lookAwayTime)}
              </div>
            </CardContent>
          </Card>
        )}

        <Modal
          isOpen={showLookAwayModal}
          title="Time to look away!"
          description="Look at least 20 feet away for 20 seconds."
          actionText="Continue"
          onAction={handleLookAwayStart}
          onCancel={handleLookAwayCancel}
          showCancel={true}
        />

        <Modal
          isOpen={showCompletionModal}
          title="Good job!"
          description="You can start working now."
          actionText="Continue"
          onAction={handleCompletion}
          showCancel={false}
        />
      </div>
    </div>
  );
}
