import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Header Component
const Header = () => (
  <CardHeader className="bg-blue-500 text-white py-4">
    <h1 className="text-2xl text-center">Water Consumption Tracker</h1>
  </CardHeader>
);

// Weight Input Component
const WeightInput = ({ weight, setWeight }) => {
  const changeWeight = (change) =>
    setWeight((prev) => Math.max(1, prev + change * 0.25));

  return (
    <div className="flex items-center justify-center my-4">
      <Button onClick={() => changeWeight(-1)}>-</Button>
      <span className="mx-4 text-lg">{weight.toFixed(2)} kg</span>
      <Button onClick={() => changeWeight(1)}>+</Button>
    </div>
  );
};

// Water Input Component
const WaterInput = ({ consumed, setConsumed }) => {
  const changeWater = (change) =>
    setConsumed((prev) => Math.max(0, prev + change * 0.25));

  return (
    <div className="flex items-center justify-center">
      <Button onClick={() => changeWater(-1)}>-</Button>
      <span className="mx-4 text-lg">{consumed.toFixed(2)} L</span>
      <Button onClick={() => changeWater(1)}>+</Button>
    </div>
  );
};

// Consumption Display with Progress Bar
const ConsumptionDisplay = ({ consumed, goal }) => {
  const percentage = Math.min((consumed / goal) * 100, 200);
  let barColor = "bg-red-500";
  if (percentage >= 50 && percentage < 100) barColor = "bg-yellow-500";
  else if (percentage >= 100 && percentage < 150) barColor = "bg-green-500";
  else if (percentage >= 150) barColor = "bg-red-500";

  return (
    <div className="my-4">
      <div
        className="h-4 rounded-full mb-2"
        style={{
          background: `linear-gradient(to right, ${barColor} ${percentage}%, #e5e7eb ${percentage}%)`,
        }}
      ></div>
      <div className="flex justify-between">
        <span>Consumed: {consumed.toFixed(2)} L</span>
        <span>
          Remaining: {(goal - consumed > 0 ? goal - consumed : 0).toFixed(2)} L
        </span>
      </div>
    </div>
  );
};

// Control Buttons Component
const ControlButtons = ({ onAdd, onClear }) => (
  <div className="flex space-x-4 justify-center my-4">
    <Button onClick={onAdd} className="bg-green-500">
      Add
    </Button>
    <Button onClick={onClear} className="bg-red-500">
      Clear
    </Button>
  </div>
);

// Main App Component
export default function App() {
  const [weight, setWeight] = useState(65);
  const [consumed, setConsumed] = useState(0);
  const goal = weight * 0.03;

  const addConsumed = () => setConsumed(0);
  const clearConsumed = () => setConsumed(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <Card className="max-w-lg mx-auto">
        <Header />
        <CardContent>
          <WeightInput weight={weight} setWeight={setWeight} />
          <WaterInput consumed={consumed} setConsumed={setConsumed} />
          <ConsumptionDisplay consumed={consumed} goal={goal} />
          <ControlButtons onAdd={addConsumed} onClear={clearConsumed} />
        </CardContent>
      </Card>
    </div>
  );
}
