import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const calculateWaterGoal = (weight) => {
  return Number((weight * 0.03).toFixed(2));
};

export default function App() {
  const [weight, setWeight] = useState(65);
  const [waterGoal, setWaterGoal] = useState(calculateWaterGoal(50));
  const [waterConsumed, setWaterConsumed] = useState(0);
  const [inputAmount, setInputAmount] = useState(0.0);

  useEffect(() => {
    setWaterGoal(calculateWaterGoal(weight));
  }, [weight]);

  const handleWeightChange = (amount) => {
    setWeight((prev) => Math.max(prev + amount, 1));
  };

  const handleInputChange = (amount) => {
    setInputAmount((prev) => Math.max(Number((prev + amount).toFixed(2)), 0));
  };

  const handleAdd = () => {
    setWaterConsumed((prev) => Number((prev + inputAmount).toFixed(2)));
    setInputAmount(0.0);
  };

  const handleClear = () => {
    setWaterConsumed(0);
    setInputAmount(0.0);
  };

  const getProgressColor = (consumed, goal) => {
    const percentage = (consumed / goal) * 100;
    if (percentage > 150 || percentage < 50) return "bg-red-500";
    if (percentage >= 100) return "bg-green-500";
    return "bg-yellow-500";
  };

  const progressPercentage = Math.min((waterConsumed / waterGoal) * 100, 150);
  const waterRemaining = Math.max(waterGoal - waterConsumed, 0).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="text-3xl text-center">
            Water Consumption Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="bg-white p-4 rounded-lg shadow-inner">
            <p className="text-sm font-medium text-center text-gray-700 mb-2">
              Your Weight (kg)
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleWeightChange(-1)}
                className="h-10 w-10 text-xl font-bold"
              >
                −
              </Button>
              <span className="text-2xl font-bold w-20 text-center">
                {weight} kg
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleWeightChange(1)}
                className="h-10 w-10 text-xl font-bold"
              >
                +
              </Button>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 overflow-hidden">
            <div
              className={`h-4 ${getProgressColor(
                waterConsumed,
                waterGoal
              )} transition-all duration-300 ease-in-out`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-inner">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2 text-gray-700">
                Consumed
              </p>
              <p className="text-3xl font-bold text-green-600">
                {waterConsumed.toFixed(2)} L
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold mb-2 text-gray-700">
                Remaining
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {waterRemaining} L
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-inner">
            <p className="text-sm font-medium text-center text-gray-700 mb-2">
              Add Water Amount (L)
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleInputChange(-0.25)}
                className="h-10 w-10 text-xl font-bold"
              >
                −
              </Button>
              <span className="text-2xl font-bold w-20 text-center">
                {inputAmount.toFixed(2)} L
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleInputChange(0.25)}
                className="h-10 w-10 text-xl font-bold"
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleAdd}
              className="w-24 bg-green-500 hover:bg-green-600"
            >
              Add
            </Button>
            <Button
              onClick={handleClear}
              variant="destructive"
              className="w-24"
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
