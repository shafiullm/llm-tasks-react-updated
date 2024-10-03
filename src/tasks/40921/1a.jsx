import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function App() {
  const [weight, setWeight] = useState(65);
  const [currentConsumption, setCurrentConsumption] = useState(0);
  const [totalConsumed, setTotalConsumed] = useState(0);

  const expectedConsumption = weight * 0.03;

  const handleWeightChange = (change) => {
    setWeight((prev) => Math.max(0, prev + change));
  };

  const handleConsumptionChange = (change) => {
    setCurrentConsumption((prev) => Math.max(0, prev + change));
  };

  const addConsumption = () => {
    setTotalConsumed((prev) => prev + currentConsumption);
    setCurrentConsumption(0);
  };

  const clearConsumption = () => {
    setTotalConsumed(0);
    setCurrentConsumption(0);
  };

  const progressPercentage = (totalConsumed / expectedConsumption) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-teal-100 flex flex-col items-center justify-center py-10">
      <Header />
      <Card className="w-full max-w-sm p-4">
        <CardContent className="p-0 space-y-4">
          <WeightInput weight={weight} onChange={handleWeightChange} />
          <ConsumptionInput
            consumption={currentConsumption}
            onChange={handleConsumptionChange}
          />
          <ProgressDisplay
            consumed={totalConsumed}
            remaining={Math.max(0, expectedConsumption - totalConsumed)}
            percentage={progressPercentage}
          />
          <ControlButtons onAdd={addConsumption} onClear={clearConsumption} />
        </CardContent>
      </Card>
    </div>
  );
}

function Header() {
  return (
    <CardHeader className="mb-4 w-full max-w-sm">
      <CardTitle className="text-center text-white bg-blue-600 p-4 rounded-lg">
        Water Consumption Tracker
      </CardTitle>
    </CardHeader>
  );
}

function WeightInput({ weight, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-lg">Your Weight:</span>
      <div className="flex items-center">
        <Button variant="outline" onClick={() => onChange(-0.5)}>
          -
        </Button>
        <span className="mx-4">{weight.toFixed(1)} kg</span>
        <Button variant="outline" onClick={() => onChange(0.5)}>
          +
        </Button>
      </div>
    </div>
  );
}

function ConsumptionInput({ consumption, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-lg">Add Water:</span>
      <div className="flex items-center">
        <Button variant="outline" onClick={() => onChange(-0.25)}>
          -
        </Button>
        <span className="mx-4">{consumption.toFixed(2)} L</span>
        <Button variant="outline" onClick={() => onChange(0.25)}>
          +
        </Button>
      </div>
    </div>
  );
}

function ProgressDisplay({ consumed, remaining, percentage }) {
  let barColor = "bg-red-500";
  if (percentage >= 100) barColor = "bg-green-500";
  else if (percentage > 50) barColor = "bg-yellow-500";
  if (percentage > 150) barColor = "bg-red-500";

  return (
    <div>
      <div className="h-4 rounded-full bg-gray-200 mb-2">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${Math.min(200, percentage)}%` }}
        ></div>
      </div>
      <div className="flex justify-between">
        <span>Consumed: {consumed.toFixed(2)} L</span>
        <span>Remaining: {remaining.toFixed(2)} L</span>
      </div>
    </div>
  );
}

function ControlButtons({ onAdd, onClear }) {
  return (
    <div className="flex justify-between mt-4">
      <Button className="bg-green-500 hover:bg-green-600" onClick={onAdd}>
        Add
      </Button>
      <Button className="bg-red-500 hover:bg-red-600" onClick={onClear}>
        Clear
      </Button>
    </div>
  );
}
