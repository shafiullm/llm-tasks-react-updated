import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const activities = [
  "Reading",
  "Exercise",
  "Meditation",
  "Gaming",
  "Watching",
  "Grooming",
  "Shopping",
  "Others",
];
const units = ["hours", "sets", "minutes"];

const ActivityCard = ({
  activity,
  onDelete,
  onEdit,
  onIncrement,
  onDecrement,
}) => (
  <Card className="mb-5 relative">
    <CardContent className="p-4">
      <Button
        onClick={() => onDelete(activity.id)}
        size="sm"
        variant="outline"
        className="text-red-500 absolute top-4 right-4 p-3"
      >
        x
      </Button>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold mr-2">{activity.name}</h3>
          <Button onClick={() => onEdit(activity)} size="sm" variant="outline">
            Edit
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {activity.amount} {activity.unit}
        </p>
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => onDecrement(activity.id)}
            size="sm"
            className="p-3.5 bg-gradient-to-r from-rose-400 to-red-500"
          >
            -
          </Button>
          <Button
            onClick={() => onIncrement(activity.id)}
            size="sm"
            className="bg-gradient-to-r from-emerald-500 to-emerald-900"
          >
            +
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AddActivityDialog = ({
  onAddActivity,
  onEditActivity,
  activityToEdit,
  open,
  onOpenChange,
}) => {
  const [name, setName] = useState("");
  const [customName, setCustomName] = useState("");
  const [unit, setUnit] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (activityToEdit) {
      setName(
        activities.includes(activityToEdit.name)
          ? activityToEdit.name
          : "Others"
      );
      setCustomName(
        activities.includes(activityToEdit.name) ? "" : activityToEdit.name
      );
      setUnit(activityToEdit.unit);
      setAmount(activityToEdit.amount.toString());
    } else {
      setName("");
      setCustomName("");
      setUnit("");
      setAmount("");
    }
  }, [activityToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const activityName = name === "Others" ? customName : name;
    const activityData = { name: activityName, unit, amount: parseInt(amount) };

    if (activityToEdit) {
      onEditActivity({ ...activityData, id: activityToEdit.id });
    } else {
      onAddActivity(activityData);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-r from-neutral-300 to-stone-400 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {activityToEdit ? "Edit Activity" : "Add New Activity"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select onValueChange={setName} value={name} required>
            <SelectTrigger>
              <SelectValue placeholder="Select an activity" />
            </SelectTrigger>
            <SelectContent>
              {activities.map((activity) => (
                <SelectItem key={activity} value={activity}>
                  {activity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {name === "Others" && (
            <Input
              placeholder="Enter custom activity"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              required
            />
          )}
          <Select onValueChange={setUnit} value={unit} required>
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
          />
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-slate-900 to-slate-700"
          >
            {activityToEdit ? "Update Activity" : "Add Activity"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ActivityList = ({
  activities,
  onDelete,
  onEdit,
  onIncrement,
  onDecrement,
}) => (
  <div>
    {activities.length === 0 ? (
      <p className="text-center text-gray-900 my-4 text-l">
        No activities added. Add an activity now.
        <br></br>
        <br></br>
      </p>
    ) : (
      activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onDelete={onDelete}
          onEdit={onEdit}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
      ))
    )}
  </div>
);

const TotalActivities = ({ activities }) => {
  const activityTotals = activities.reduce((acc, activity) => {
    if (!acc[activity.name]) {
      acc[activity.name] = {};
    }
    if (!acc[activity.name][activity.unit]) {
      acc[activity.name][activity.unit] = { count: 0, total: 0 };
    }
    acc[activity.name][activity.unit].count += 1;
    acc[activity.name][activity.unit].total += activity.amount;
    return acc;
  }, {});

  const totalActivities = Object.entries(activityTotals);

  if (totalActivities.length < 2) return null;

  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Total Activities</h3>
      <ul>
        {totalActivities.map(([name, units]) => (
          <li key={name} className="text-sm text-gray-600 mb-2">
            <span className="font-medium">{name}:</span>{" "}
            {Object.entries(units).map(
              ([unit, { count, total }], index, arr) => (
                <span key={unit}>
                  {count} {count > 1 ? "times" : "time"} ({total} {unit})
                  {index < arr.length - 1 ? ", " : ""}
                </span>
              )
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function App() {
  const [activities, setActivities] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState(null);

  const addActivity = (newActivity) => {
    setActivities([...activities, { ...newActivity, id: Date.now() }]);
    setDialogOpen(false);
  };

  const deleteActivity = (id) => {
    setActivities(activities.filter((activity) => activity.id !== id));
  };

  const editActivity = (editedActivity) => {
    setActivityToEdit(editedActivity);
    setDialogOpen(true);
  };

  const updateActivity = (updatedActivity) => {
    setActivities(
      activities.map((activity) =>
        activity.id === updatedActivity.id ? updatedActivity : activity
      )
    );
    setActivityToEdit(null);
  };

  const incrementAmount = (id) => {
    setActivities(
      activities.map((activity) =>
        activity.id === id
          ? { ...activity, amount: activity.amount + 1 }
          : activity
      )
    );
  };

  const decrementAmount = (id) => {
    setActivities(
      activities.map((activity) =>
        activity.id === id && activity.amount > 1
          ? { ...activity, amount: activity.amount - 1 }
          : activity
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Card className="max-w-md mx-auto bg-gradient-to-r from-neutral-300 to-stone-400">
        <CardHeader>
          <CardTitle className="text-gray-900 font-semibold text-2xl text-center">
            Activity Tracker
          </CardTitle>
          <p className="text-center text-gray-800">
            {new Date().toDateString()}
          </p>
        </CardHeader>
        <CardContent>
          <TotalActivities activities={activities} />
          <ActivityList
            activities={activities}
            onDelete={deleteActivity}
            onEdit={editActivity}
            onIncrement={incrementAmount}
            onDecrement={decrementAmount}
          />
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) setActivityToEdit(null);
            }}
          >
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-slate-900 to-slate-700">
                Add Activity
              </Button>
            </DialogTrigger>
          </Dialog>
          <AddActivityDialog
            onAddActivity={addActivity}
            onEditActivity={updateActivity}
            activityToEdit={activityToEdit}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
          />
        </CardContent>
      </Card>
    </div>
  );
}
