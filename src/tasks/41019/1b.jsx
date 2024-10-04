import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function App() {
  const [activities, setActivities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    activity: "Reading",
    unit: "hours",
    amount: 1,
    otherActivity: "",
  });

  const handleAddActivity = (e) => {
    e.preventDefault();
    const newActivity =
      formData.activity === "Others"
        ? formData.otherActivity
        : formData.activity;
    setActivities([...activities, { ...formData, activity: newActivity }]);
    setIsModalOpen(false);
    setFormData({
      activity: "Reading",
      unit: "hours",
      amount: 1,
      otherActivity: "",
    });
  };

  const handleDelete = (index) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    const activityToEdit = activities[index];
    setFormData({
      ...activityToEdit,
      activity:
        activityToEdit.activity === activityToEdit.otherActivity
          ? "Others"
          : activityToEdit.activity,
    });
    handleDelete(index);
    setIsModalOpen(true);
  };

  const handleAmountChange = (index, delta) => {
    setActivities(
      activities.map((act, i) =>
        i === index ? { ...act, amount: Math.max(1, act.amount + delta) } : act
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Activity Tracker</h1>
      <p className="text-center mb-4">{new Date().toDateString()}</p>

      <Card className="mb-4 bg-gradient-to-r from-clay-start to-clay-end">
        <CardHeader>
          <CardTitle>Your Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p>No activities added. Add an activity now.</p>
          ) : (
            <ActivityList
              activities={activities}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onAmountChange={handleAmountChange}
            />
          )}
        </CardContent>
        <CardContent>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-slate-800 to-black"
          >
            Add Activity
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleAddActivity}>
            <div className="grid gap-4 py-4">
              <Label htmlFor="activity">Select an activity</Label>
              <Select
                value={formData.activity}
                onChange={(e) =>
                  setFormData({ ...formData, activity: e.target.value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an activity" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Reading",
                    "Exercise",
                    "Meditation",
                    "Gaming",
                    "Watching",
                    "Grooming",
                    "Shopping",
                    "Others",
                  ].map((act) => (
                    <SelectItem key={act} value={act}>
                      {act}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.activity === "Others" && (
                <Input
                  type="text"
                  placeholder="Enter your activity"
                  value={formData.otherActivity}
                  onChange={(e) =>
                    setFormData({ ...formData, otherActivity: e.target.value })
                  }
                  required
                />
              )}
              <Label htmlFor="unit">Select unit</Label>
              <Select
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="times">Times</SelectItem>
                  <SelectItem value="minutes">Minutes</SelectItem>
                </SelectContent>
              </Select>
              <Label htmlFor="amount">Select Amount</Label>
              <Input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: parseInt(e.target.value, 10) || 1,
                  })
                }
                min="1"
                required
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-slate-800 to-black"
              >
                Add Activity
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ActivityList({ activities, onDelete, onEdit, onAmountChange }) {
  return (
    <div className="grid gap-4">
      {activities.map((act, index) => (
        <ActivityCard
          key={index}
          activity={act}
          onDelete={() => onDelete(index)}
          onEdit={() => onEdit(index)}
          onAmountChange={onAmountChange}
          index={index}
        />
      ))}
    </div>
  );
}

function ActivityCard({ activity, onDelete, onEdit, onAmountChange, index }) {
  return (
    <Card className="p-2">
      <CardContent className="p-0">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg">{activity.activity}</h2>
            <p>
              {activity.amount} {activity.unit}
            </p>
            <div className="mt-2">
              <Button
                onClick={() => onAmountChange(index, -1)}
                className="mr-2 bg-gradient-to-r from-red-700 to-red-900"
              >
                -
              </Button>
              <Button
                onClick={() => onAmountChange(index, 1)}
                className="bg-gradient-to-r from-green-700 to-green-900"
              >
                +
              </Button>
            </div>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" onClick={onEdit} className="mr-2">
              Edit
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              X
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
