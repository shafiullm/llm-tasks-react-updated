import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Modal,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const currencies = ["$", "€", "£", "₹", "৳", "¥", "₱"];

function App() {
  const [loans, setLoans] = useState([]);
  const [currencyIndex, setCurrencyIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLoan, setNewLoan] = useState({
    name: "",
    amount: "",
    takenDate: "",
    repayDate: "",
  });
  const [showNotification, setShowNotification] = useState(false);

  const dashboardStats = {
    totalLoaned: loans.reduce(
      (sum, loan) => sum + (loan.paid ? 0 : loan.amount),
      0
    ),
    totalRepaid: loans.reduce(
      (sum, loan) => sum + (loan.paid ? loan.amount : 0),
      0
    ),
    loansTaken: loans.length,
    loansRepaid: loans.filter((loan) => loan.paid).length,
  };

  useEffect(() => {
    const checkDueDates = () => {
      const today = new Date();
      const withinWeek = loans.some(
        (loan) =>
          !loan.paid &&
          new Date(loan.repayDate) <=
            new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      );
      setShowNotification(withinWeek);
    };
    checkDueDates();
  }, [loans]);

  const addLoan = () => {
    setLoans([...loans, { ...newLoan, paid: false }]);
    setNewLoan({ name: "", amount: "", takenDate: "", repayDate: "" });
    setIsModalOpen(false);
  };

  const repayLoan = (index) => {
    const updatedLoans = [...loans];
    updatedLoans[index].paid = true;
    setLoans(updatedLoans);
  };

  const sortBy = (key) => {
    setLoans(
      [...loans].sort((a, b) =>
        a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0
      )
    );
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <Card className="w-full max-w-md p-4 sm:p-6">
        <Header />
        {showNotification && (
          <Modal onClose={() => setShowNotification(false)}>
            <div className="p-4 text-white">
              Reminder: Some loans are due soon!
            </div>
          </Modal>
        )}
        <Dashboard
          stats={dashboardStats}
          currency={currencies[currencyIndex]}
          onCurrencyChange={() =>
            setCurrencyIndex((currencyIndex + 1) % currencies.length)
          }
        />
        <LoanForm
          loan={newLoan}
          setLoan={setNewLoan}
          onSubmit={addLoan}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        <Button
          className="mt-4 bg-brown-600 hover:bg-brown-700"
          onClick={() => setIsModalOpen(true)}
        >
          Add Loan
        </Button>
        <Button
          className="mt-2 bg-brown-600 hover:bg-brown-700"
          onClick={() => setIsModalOpen(true)}
        >
          All Loans
        </Button>
        <LoanListModal
          loans={loans}
          repayLoan={repayLoan}
          sortBy={sortBy}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </Card>
    </div>
  );
}

function Header() {
  return (
    <h1 className="text-center text-2xl font-bold mb-4 text-white">
      Loan Tracker
    </h1>
  );
}

function Dashboard({ stats, currency, onCurrencyChange }) {
  return (
    <div className="text-center text-white mb-4">
      <h2 className="text-xl mb-2">Dashboard</h2>
      <div className="cursor-pointer" onClick={onCurrencyChange}>
        {currency}
      </div>
      <p>
        Total Loaned: {currency}
        {stats.totalLoaned}
      </p>
      <p>
        Total Repaid: {currency}
        {stats.totalRepaid}
      </p>
      <p>Loans Taken: {stats.loansTaken}</p>
      <p>Loans Repaid: {stats.loansRepaid}</p>
    </div>
  );
}

function LoanForm({ loan, setLoan, onSubmit, isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card>
        <CardHeader>
          <CardTitle>Add New Loan</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="name">Borrower's Name</Label>
          <Input
            id="name"
            value={loan.name}
            onChange={(e) => setLoan({ ...loan, name: e.target.value })}
          />
          {/* Similar Input fields for amount, takenDate, repayDate */}
        </CardContent>
        <CardFooter>
          <Button onClick={onSubmit}>Add Loan</Button>
        </CardFooter>
      </Card>
    </Modal>
  );
}

function LoanListModal({ loans, repayLoan, sortBy, isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell onClick={() => sortBy("name")}>Name</TableCell>
            <TableCell onClick={() => sortBy("amount")}>Amount</TableCell>
            <TableCell onClick={() => sortBy("repayDate")}>Repay By</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan, index) => (
            <TableRow key={index}>
              <TableCell>{loan.name}</TableCell>
              <TableCell>{loan.amount}</TableCell>
              <TableCell>{loan.repayDate}</TableCell>
              <TableCell>
                <Button
                  className={
                    loan.paid
                      ? "bg-gray-500"
                      : "bg-brown-600 hover:bg-brown-700"
                  }
                  onClick={() => repayLoan(index)}
                  disabled={loan.paid}
                >
                  {loan.paid ? "Paid" : "Repay"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Modal>
  );
}

export default App;
