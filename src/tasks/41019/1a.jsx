// App.jsx
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ActivityList from "./components/ActivityList";
import ActivityForm from "./components/ActivityForm";

const clayGradient = "bg-gradient-to-r from-gray-100 to-gray-300";
const blackSlateGradient = "bg-gradient-to-r from-slate-800 to-black";

export default function App() {
  const [activities, setActivities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editActivity, setEditActivity] = useState(null);

  const addActivity = (activity) => {
    if (editActivity) {
      setActivities(
        activities.map((a) => (a.id === editActivity.id ? activity : a))
      );
      setEditActivity(null);
    } else {
      setActivities([...activities, { ...activity, id: Date.now() }]);
    }
    setShowForm(false);
  };

  const deleteActivity = (id) => {
    setActivities(activities.filter((a) => a.id !== id));
  };

  const startEdit = (activity) => {
    setEditActivity(activity);
    setShowForm(true);
  };

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-4">Activity Tracker</h1>
      <div className="text-sm mb-4">Date: {new Date().toDateString()}</div>
      {activities.length > 1 && (
        <div className="mb-4">Total Activities: {activities.length}</div>
      )}
      <Card className={`${clayGradient} p-4 mb-4`}>
        <CardContent>
          {activities.length === 0 ? (
            <p>No activities added. Add an activity now.</p>
          ) : (
            <ActivityList
              activities={activities}
              onDelete={deleteActivity}
              onEdit={startEdit}
            />
          )}
        </CardContent>
      </Card>
      <Button
        className={`${blackSlateGradient} text-white`}
        onClick={() => setShowForm(true)}
      >
        Add Activity
      </Button>
      {showForm && (
        <ActivityForm
          onSubmit={addActivity}
          onClose={() => {
            setShowForm(false);
            setEditActivity(null);
          }}
          activity={editActivity}
        />
      )}
    </div>
  );
}

// components/ActivityList.jsx and other components would follow similar structure with Tailwind and Shadcn UI usage.
