import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { format } from "date-fns";

// Currency symbols
const currencies = {
  dollar: "$",
  euro: "€",
  pound: "£",
  rupee: "₹",
  taka: "৳",
  yen: "¥",
  peso: "₱",
};

export default function App() {
  const [loans, setLoans] = useState([]);
  const [currency, setCurrency] = useState("dollar");
  const [showLoanList, setShowLoanList] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const checkDueLoans = () => {
      const today = new Date();
      const dueLoans = loans.filter((loan) => {
        const dueDate = new Date(loan.dueDate);
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays > 0 && !loan.paid;
      });
      if (dueLoans.length) {
        setNotification(`Reminder: ${dueLoans.length} loan(s) due soon!`);
      } else {
        setNotification(null);
      }
    };
    checkDueLoans();
  }, [loans]);

  const addLoan = (newLoan) => {
    setLoans([...loans, { ...newLoan, id: Date.now(), paid: false }]);
  };

  const repayLoan = (id) => {
    setLoans(
      loans.map((loan) => (loan.id === id ? { ...loan, paid: true } : loan))
    );
  };

  const sortedLoans = [...loans].sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
  );

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

  return (
    <div className="bg-black text-white min-h-screen p-4">
      <Header />
      {notification && <NotificationModal message={notification} />}
      <Card className="mt-4 bg-black border border-white">
        <CardHeader>
          <CardTitle className="text-center">Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <CurrencySelector current={currency} onChange={setCurrency} />
          <Dashboard stats={dashboardStats} currency={currencies[currency]} />
        </CardContent>
        <Button
          onClick={() => setShowLoanList(!showLoanList)}
          className="bg-brown-500 m-2"
        >
          {showLoanList ? "Hide Loans" : "All Loans"}
        </Button>
        {showLoanList && <LoanList loans={sortedLoans} repayLoan={repayLoan} />}
        <LoanForm onSubmit={addLoan} />
      </Card>
    </div>
  );
}

// Component Definitions...

// Header Component
function Header() {
  return <h1 className="text-3xl font-bold text-center">Loan Tracker</h1>;
}

// Dashboard Component
function Dashboard({ stats, currency }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(stats).map(([key, value]) => (
        <div key={key}>
          <p>{key.replace("Loans", "Loans ")}</p>
          <p>
            {currency}
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}

// CurrencySelector Component
function CurrencySelector({ current, onChange }) {
  return (
    <div className="text-right mb-2">
      {Object.keys(currencies).map((key) => (
        <span
          key={key}
          onClick={() => onChange(key)}
          className={`cursor-pointer ${current === key ? "font-bold" : ""}`}
        >
          {currencies[key]}
        </span>
      ))}
    </div>
  );
}

// LoanForm Component
function LoanForm({ onSubmit }) {
  const [loan, setLoan] = useState({
    name: "",
    amount: "",
    dateTaken: "",
    dueDate: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(loan);
    setLoan({ name: "", amount: "", dateTaken: "", dueDate: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {/* Form fields for name, amount, etc. */}
      <Button type="submit" className="bg-brown-500">
        Add Loan
      </Button>
    </form>
  );
}

// LoanList and LoanRow Components would follow similar patterns for displaying and interacting with loans

// NotificationModal for due loans
function NotificationModal({ message }) {
  return (
    <div className="bg-yellow-100 text-black p-2 text-center">{message}</div>
  );
}

// Note: This code structure assumes you'll implement sorting, detailed forms, and modal functionality in actual components.
