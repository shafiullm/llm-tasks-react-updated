import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const units = ["pill", "mg", "capsule", "drop"];
const frequencies = [
  "Once daily",
  "Twice daily",
  "Thrice daily",
  "Interval",
  "No reminder",
];

const formatTime = (time) => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? "PM" : "AM"}`;
};

const MedicineCard = ({ medicine, onRemove, onUpdateAmount }) => (
  <Card className="w-full mb-4 relative">
    <Button
      onClick={() => onRemove(medicine)}
      className="absolute top-2 right-2 p-1 h-6 w-6 rounded-full"
      variant="ghost"
    >
      ✕
    </Button>
    <CardHeader>
      <CardTitle>{medicine.name}</CardTitle>
      <CardDescription>
        {medicine.frequency === "Interval"
          ? `Every ${medicine.interval.value} ${medicine.interval.unit}`
          : medicine.frequency}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="mb-4">
        {medicine.times &&
          medicine.times.map((time, index) => (
            <div key={index} className="text-sm">
              <span className="font-semibold">{formatTime(time.time)}</span> -{" "}
              {time.dose} {medicine.unit}
            </div>
          ))}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm">
          Amount left: {medicine.amountLeft} {medicine.unit}
        </p>
        <div className="space-x-0">
          <Button
            onClick={() => onUpdateAmount(medicine, -1)}
            className="w-8 h-8 p-0"
            variant="outline"
          >
            -
          </Button>
          <Button
            onClick={() => onUpdateAmount(medicine, 1)}
            className="w-8 h-8 p-0"
            variant="outline"
          >
            +
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AddMedicineModal = ({ isOpen, onClose, onAdd }) => {
  const [step, setStep] = useState(1);
  const [medicine, setMedicine] = useState({
    name: "",
    unit: "",
    frequency: "",
    times: [],
    interval: { value: "", unit: "hours" },
    totalAmount: "",
    amountLeft: "",
  });

  const handleInputChange = (e) =>
    setMedicine((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFrequencyChange = (value) => {
    const times =
      value === "Once daily"
        ? [{ time: "", dose: "" }]
        : value === "Twice daily"
        ? [
            { time: "", dose: "" },
            { time: "", dose: "" },
          ]
        : value === "Thrice daily"
        ? [
            { time: "", dose: "" },
            { time: "", dose: "" },
            { time: "", dose: "" },
          ]
        : [];
    setMedicine((prev) => ({ ...prev, frequency: value, times }));
  };
  const handleTimeChange = (index, field, value) =>
    setMedicine((prev) => ({
      ...prev,
      times: prev.times.map((t, i) =>
        i === index ? { ...t, [field]: value } : t
      ),
    }));
  const handleIntervalChange = (field, value) =>
    setMedicine((prev) => ({
      ...prev,
      interval: { ...prev.interval, [field]: value },
    }));

  const handleSubmit = () => {
    onAdd({ ...medicine, amountLeft: medicine.totalAmount });
    onClose();
    setStep(1);
    setMedicine({
      name: "",
      unit: "",
      frequency: "",
      times: [],
      interval: { value: "", unit: "hours" },
      totalAmount: "",
      amountLeft: "",
    });
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return medicine.name.trim() !== "" && medicine.unit !== "";
      case 2:
        if (medicine.frequency === "Interval") {
          return (
            medicine.interval.value !== "" &&
            medicine.interval.startTime !== "" &&
            medicine.interval.endTime !== "" &&
            medicine.interval.dose !== ""
          );
        }
        return (
          medicine.frequency !== "" &&
          medicine.times.every((t) => t.time !== "" && t.dose !== "")
        );
      case 3:
        return medicine.totalAmount !== "";
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Medicine</DialogTitle>
          <DialogDescription>
            {step === 1 &&
              "What medicine would you want to set the reminder for?"}
            {step === 2 && "How often do you take this medicine?"}
            {step === 3 && "Enter total amount of this medicine"}
          </DialogDescription>
        </DialogHeader>
        {step === 1 && (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={medicine.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit" className="text-right">
                  Unit
                </Label>
                <Select
                  onValueChange={(value) =>
                    setMedicine((prev) => ({ ...prev, unit: value }))
                  }
                  required
                >
                  <SelectTrigger className="col-span-3">
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
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setStep(2)} disabled={!isStepValid()}>
                Next
              </Button>
            </DialogFooter>
          </>
        )}
        {step === 2 && (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="frequency" className="text-right">
                  Frequency
                </Label>
                <Select onValueChange={handleFrequencyChange} required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {medicine.frequency === "Interval" && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="intervalValue" className="text-right">
                      Every
                    </Label>
                    <Input
                      id="intervalValue"
                      name="intervalValue"
                      type="number"
                      value={medicine.interval.value}
                      onChange={(e) =>
                        handleIntervalChange("value", e.target.value)
                      }
                      className="col-span-1"
                      required
                    />
                    <Select
                      value={medicine.interval.unit}
                      onValueChange={(value) =>
                        handleIntervalChange("unit", value)
                      }
                      required
                    >
                      <SelectTrigger className="col-span-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">minutes</SelectItem>
                        <SelectItem value="hours">hours</SelectItem>
                        <SelectItem value="days">days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startTime" className="text-right">
                      Start at
                    </Label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="time"
                      onChange={(e) =>
                        handleIntervalChange("startTime", e.target.value)
                      }
                      className="col-span-2"
                      style={{ width: "80%" }}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endTime" className="text-right">
                      End at
                    </Label>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="time"
                      onChange={(e) =>
                        handleIntervalChange("endTime", e.target.value)
                      }
                      className="col-span-2"
                      style={{ width: "80%" }}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dose" className="text-right">
                      Dose
                    </Label>
                    <Input
                      id="dose"
                      name="dose"
                      type="number"
                      onChange={(e) =>
                        handleIntervalChange("dose", e.target.value)
                      }
                      className="col-span-2"
                      required
                    />
                    <Label className="text-left col-span-1">
                      {medicine.unit}
                    </Label>
                  </div>
                </>
              )}
              {medicine.times.map((time, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 items-center gap-4"
                >
                  <Label
                    htmlFor={`time-${index}`}
                    className="text-right col-span-3"
                  >
                    Time {index + 1}
                  </Label>
                  <div className="col-span-9 grid grid-cols-12 gap-4">
                    <Input
                      id={`time-${index}`}
                      type="time"
                      value={time.time}
                      onChange={(e) =>
                        handleTimeChange(index, "time", e.target.value)
                      }
                      className="col-span-5"
                      style={{ width: "125%" }}
                      required
                    />
                    <Input
                      id={`dose-${index}`}
                      type="number"
                      value={time.dose}
                      onChange={(e) =>
                        handleTimeChange(index, "dose", e.target.value)
                      }
                      className="col-span-4"
                      style={{ width: "80%", margin: "0 20px" }}
                      required
                    />
                    <Label className="text-left col-span-3 flex items-center">
                      {medicine.unit}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={() => setStep(1)} variant="outline">
                Back
              </Button>
              <Button onClick={() => setStep(3)} disabled={!isStepValid()}>
                Next
              </Button>
            </DialogFooter>
          </>
        )}
        {step === 3 && (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="totalAmount" className="text-right">
                  Total Amount
                </Label>
                <Input
                  id="totalAmount"
                  name="totalAmount"
                  type="number"
                  value={medicine.totalAmount}
                  onChange={handleInputChange}
                  className="col-span-2"
                  required
                />
                <Label className="text-left">{medicine.unit}</Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setStep(2)} variant="outline">
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={!isStepValid()}>
                Finish
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default function App() {
  const [medicines, setMedicines] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addMedicine = (newMedicine) =>
    setMedicines((prev) => [...prev, newMedicine]);
  const removeMedicine = (medicineToRemove) =>
    setMedicines((prev) =>
      prev.filter((medicine) => medicine !== medicineToRemove)
    );
  const updateMedicineAmount = (medicineToUpdate, amount) =>
    setMedicines((prev) =>
      prev.map((medicine) =>
        medicine === medicineToUpdate
          ? {
              ...medicine,
              amountLeft: Math.max(0, Number(medicine.amountLeft) + amount),
            }
          : medicine
      )
    );

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle>Medicine Tracker</CardTitle>
          <CardDescription>Keep track of your medications</CardDescription>
        </CardHeader>
        <CardContent>
          {medicines.length === 0 ? (
            <p className="text-center">
              No medicine reminder. Add a medicine now.
            </p>
          ) : (
            medicines.map((medicine, index) => (
              <MedicineCard
                key={index}
                medicine={medicine}
                onRemove={removeMedicine}
                onUpdateAmount={updateMedicineAmount}
              />
            ))
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            Add Medicine
          </Button>
        </CardFooter>
      </Card>
      <AddMedicineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addMedicine}
      />
    </div>
  );
}
