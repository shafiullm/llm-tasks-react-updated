import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui";
import { Input, Select, SelectItem } from "@/components/ui/input";

function App() {
  const [medicines, setMedicines] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentMedicine, setCurrentMedicine] = useState({});

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setCurrentMedicine({});
  };

  const saveMedicine = () => {
    if (currentMedicine.id) {
      setMedicines(
        medicines.map((m) =>
          m.id === currentMedicine.id ? currentMedicine : m
        )
      );
    } else {
      setMedicines([...medicines, { ...currentMedicine, id: Date.now() }]);
    }
    closeModal();
  };

  return (
    <div className="container mx-auto p-4">
      <MedicineList medicines={medicines} onAdd={openModal} />
      <AddMedicineModal
        isOpen={isOpen}
        onClose={closeModal}
        medicine={currentMedicine}
        setMedicine={setCurrentMedicine}
        onSave={saveMedicine}
      />
    </div>
  );
}

function MedicineList({ medicines, onAdd }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medicine Tracker</CardTitle>
        <Button onClick={onAdd} className="bg-green-500 hover:bg-green-600">
          Add Medicine
        </Button>
      </CardHeader>
      <CardContent>
        {medicines.length === 0 ? (
          <p>No medicine reminders. Add a medicine now.</p>
        ) : (
          medicines.map((med) => <MedicineCard key={med.id} medicine={med} />)
        )}
      </CardContent>
    </Card>
  );
}

function MedicineCard({ medicine }) {
  return (
    <div className="mb-4">
      <h3>{medicine.name}</h3>
      <p>Frequency: {medicine.frequency}</p>
      {/* Add more details and buttons for increment/decrement and delete */}
    </div>
  );
}

function AddMedicineModal({ isOpen, onClose, medicine, setMedicine, onSave }) {
  const [step, setStep] = useState(1);

  // Logic for modal steps would go here, including form handling for each step

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {/* Modal content would dynamically change based on 'step' */}
        <ModalHeader>Add Medicine</ModalHeader>
        <ModalBody>{/* Form fields */}</ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
          {step < 4 ? (
            <Button onClick={() => setStep(step + 1)}>Next</Button>
          ) : (
            <Button onClick={onSave}>Finish</Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default App;
