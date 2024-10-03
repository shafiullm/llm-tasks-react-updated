import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Modal,
  Input,
  Select,
  Option,
} from "@/components/ui";

export default function App() {
  const [medicines, setMedicines] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentMedicine, setCurrentMedicine] = useState({
    name: "",
    unit: "",
    frequency: "",
    times: [],
    totalAmount: "",
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentStep(1);
    setCurrentMedicine({
      name: "",
      unit: "",
      frequency: "",
      times: [],
      totalAmount: "",
    });
  };

  const handleNext = () => {
    if (currentStep === 1 && !currentMedicine.name) return;
    if (currentStep === 2 && !currentMedicine.frequency) return;
    if ((currentStep === 3 || currentStep === 4) && !validateStepThreeFour())
      return;
    setCurrentStep(currentStep + 1);
  };

  const validateStepThreeFour = () => {
    if (
      ["Once daily", "Twice daily", "Thrice daily"].includes(
        currentMedicine.frequency
      )
    ) {
      return currentMedicine.times.every((t) => t.time && t.dose);
    } else if (currentMedicine.frequency === "Interval") {
      return (
        currentMedicine.times[0].interval &&
        currentMedicine.times[0].start &&
        currentMedicine.times[0].end &&
        currentMedicine.times[0].dose
      );
    }
    return true;
  };

  const addMedicine = () => {
    if (currentMedicine.name && currentMedicine.totalAmount) {
      setMedicines([...medicines, { ...currentMedicine, id: Date.now() }]);
      closeModal();
    }
  };

  const updateMedicine = (field, value) => {
    setCurrentMedicine((prev) => ({ ...prev, [field]: value }));
  };

  const handleTimeAndDoseChange = (index, field, value) => {
    const updatedTimes = [...currentMedicine.times];
    updatedTimes[index] = { ...updatedTimes[index], [field]: value };
    updateMedicine("times", updatedTimes);
  };

  const MedicineCard = ({ medicine }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{medicine.name}</CardTitle>
        <Button
          variant="destructive"
          onClick={() =>
            setMedicines(medicines.filter((m) => m.id !== medicine.id))
          }
        >
          X
        </Button>
      </CardHeader>
      <CardContent>
        <p>Frequency: {medicine.frequency}</p>
        {medicine.times.map((time, i) => (
          <p key={i}>
            At {time.time || `Every ${time.interval}`}: {time.dose}{" "}
            {medicine.unit}
          </p>
        ))}
        <div>
          <Button
            onClick={() =>
              updateMedicine(
                "totalAmount",
                String(Number(medicine.totalAmount) - 1)
              )
            }
          >
            -
          </Button>
          <span className="mx-2">{medicine.totalAmount} left</span>
          <Button
            onClick={() =>
              updateMedicine(
                "totalAmount",
                String(Number(medicine.totalAmount) + 1)
              )
            }
          >
            +
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Medicine Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          {medicines.length > 0 ? (
            medicines.map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))
          ) : (
            <p>No medicine reminder. Add a medicine now.</p>
          )}
        </CardContent>
        <CardContent>
          <Button onClick={openModal}>Add Medicine</Button>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal} className="sm:max-w-lg">
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              {currentStep === 1 ? "Add Medicine" : "Edit Medicine"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {currentStep === 1 && (
              <>
                <Input
                  placeholder="Medicine Name"
                  value={currentMedicine.name}
                  onChange={(e) => updateMedicine("name", e.target.value)}
                />
                <Select
                  onChange={(e) => updateMedicine("unit", e)}
                  value={currentMedicine.unit}
                >
                  <Option value="">Select Unit</Option>
                  <Option value="pill">Pill</Option>
                  <Option value="mg">mg</Option>
                  <Option value="capsule">Capsule</Option>
                  <Option value="drop">Drop</Option>
                </Select>
              </>
            )}
            {currentStep === 2 && (
              <Select
                onChange={(e) => updateMedicine("frequency", e)}
                value={currentMedicine.frequency}
              >
                <Option value="">How often?</Option>
                <Option value="Once daily">Once daily</Option>
                <Option value="Twice daily">Twice daily</Option>
                <Option value="Thrice daily">Thrice daily</Option>
                <Option value="Interval">Interval</Option>
                <Option value="No reminder">No reminder</Option>
              </Select>
            )}
            {currentStep === 3 &&
              currentMedicine.frequency !== "No reminder" && (
                <>
                  {["Once daily", "Twice daily", "Thrice daily"].includes(
                    currentMedicine.frequency
                  ) &&
                    Array.from(
                      { length: currentMedicine.frequency.split(" ")[0] },
                      (_, i) => i + 1
                    ).map((num) => (
                      <div key={num}>
                        <Input
                          type="time"
                          onChange={(e) =>
                            handleTimeAndDoseChange(
                              num - 1,
                              "time",
                              e.target.value
                            )
                          }
                        />
                        <Input
                          type="number"
                          placeholder={`Dose in ${currentMedicine.unit}`}
                          onChange={(e) =>
                            handleTimeAndDoseChange(
                              num - 1,
                              "dose",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    ))}
                  {currentMedicine.frequency === "Interval" && (
                    <div>
                      <Input
                        type="number"
                        placeholder="Every X"
                        onChange={(e) =>
                          handleTimeAndDoseChange(0, "interval", e.target.value)
                        }
                      />
                      <Select
                        onChange={(e) =>
                          handleTimeAndDoseChange(0, "intervalUnit", e)
                        }
                      >
                        <Option value="hours">hours</Option>
                        <Option value="days">days</Option>
                        <Option value="minutes">minutes</Option>
                      </Select>
                      <Input
                        type="time"
                        placeholder="Start Time"
                        onChange={(e) =>
                          handleTimeAndDoseChange(0, "start", e.target.value)
                        }
                      />
                      <Input
                        type="time"
                        placeholder="End Time"
                        onChange={(e) =>
                          handleTimeAndDoseChange(0, "end", e.target.value)
                        }
                      />
                      <Input
                        type="number"
                        placeholder={`Dose in ${currentMedicine.unit}`}
                        onChange={(e) =>
                          handleTimeAndDoseChange(0, "dose", e.target.value)
                        }
                      />
                    </div>
                  )}
                </>
              )}
            {currentStep === 4 && (
              <Input
                type="number"
                placeholder="Total Amount"
                value={currentMedicine.totalAmount}
                onChange={(e) => updateMedicine("totalAmount", e.target.value)}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            {currentStep > 1 && (
              <Button onClick={() => setCurrentStep(currentStep - 1)}>
                Back
              </Button>
            )}
            {currentStep < 4 && <Button onClick={handleNext}>Next</Button>}
            {currentStep === 4 && <Button onClick={addMedicine}>Finish</Button>}
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}
