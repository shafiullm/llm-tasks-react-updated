import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const currencies = ["$", "€", "£", "₹", "৳", "¥", "₱"];

export default function App() {
  const [loans, setLoans] = useState([]);
  const [totalLoaned, setTotalLoaned] = useState(0);
  const [totalRepaid, setTotalRepaid] = useState(0);
  const [currencyIndex, setCurrencyIndex] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [isAddLoanOpen, setIsAddLoanOpen] = useState(false);
  const [upcomingLoans, setUpcomingLoans] = useState({
    oneDay: [],
    threeDays: [],
    oneWeek: [],
  });

  useEffect(() => {
    updateDashboard();
    checkUpcomingLoans();
  }, [loans]);

  const updateDashboard = () => {
    const total = loans.reduce((sum, loan) => sum + loan.amount, 0);
    const repaid = loans.reduce(
      (sum, loan) => (loan.repaid ? sum + loan.amount : sum),
      0
    );
    setTotalLoaned(total);
    setTotalRepaid(repaid);
  };

  const checkUpcomingLoans = () => {
    const today = new Date();
    const oneDayFromNow = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000);
    const threeDaysFromNow = new Date(
      today.getTime() + 3 * 24 * 60 * 60 * 1000
    );
    const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const upcoming = {
      oneDay: [],
      threeDays: [],
      oneWeek: [],
    };

    loans.forEach((loan) => {
      if (!loan.repaid) {
        const repayDate = new Date(loan.dateToRepay);
        if (repayDate <= oneDayFromNow) {
          upcoming.oneDay.push(loan);
        } else if (repayDate <= threeDaysFromNow) {
          upcoming.threeDays.push(loan);
        } else if (repayDate <= oneWeekFromNow) {
          upcoming.oneWeek.push(loan);
        }
      }
    });

    setUpcomingLoans(upcoming);
  };

  const addLoan = (e) => {
    e.preventDefault();
    const newLoan = {
      id: Date.now(),
      borrower: e.target.borrower.value,
      amount: parseFloat(e.target.amount.value),
      dateTaken: e.target.dateTaken.value,
      dateToRepay: e.target.dateToRepay.value,
      repaid: false,
    };
    setLoans([...loans, newLoan]);
    e.target.reset();
    setIsAddLoanOpen(false);
  };

  const repayLoan = (id) => {
    setLoans(
      loans.map((loan) => (loan.id === id ? { ...loan, repaid: true } : loan))
    );
  };

  const changeCurrency = () => {
    setCurrencyIndex((currencyIndex + 1) % currencies.length);
  };

  const sortLoans = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortedLoans = () => {
    const sortableLoans = [...loans];
    if (sortConfig.key) {
      sortableLoans.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableLoans;
  };

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-black text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Loan Tracker</CardTitle>
          </CardHeader>
          {(upcomingLoans.oneDay.length > 0 ||
            upcomingLoans.threeDays.length > 0 ||
            upcomingLoans.oneWeek.length > 0) && (
            <div className="px-4 pb-4">
              {upcomingLoans.oneDay.length > 0 && (
                <Alert className="mb-2 bg-red-100 border-red-400 text-red-700">
                  <AlertTitle>Urgent: Loan(s) Due Tomorrow</AlertTitle>
                  <AlertDescription>
                    You have {upcomingLoans.oneDay.length} loan(s) due within 24
                    hours.
                  </AlertDescription>
                </Alert>
              )}
              {upcomingLoans.threeDays.length > 0 && (
                <Alert className="mb-2 bg-orange-100 border-orange-400 text-orange-700">
                  <AlertTitle>Loan(s) Due Soon</AlertTitle>
                  <AlertDescription>
                    You have {upcomingLoans.threeDays.length} loan(s) due within
                    3 days.
                  </AlertDescription>
                </Alert>
              )}
              {upcomingLoans.oneWeek.length > 0 && (
                <Alert className="mb-2 bg-yellow-100 border-yellow-400 text-yellow-700">
                  <AlertTitle>Upcoming Loan Payments</AlertTitle>
                  <AlertDescription>
                    You have {upcomingLoans.oneWeek.length} loan(s) due within
                    the next week.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          <CardContent>
            <h2 className="text-xl text-center mb-4">Dashboard</h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm">Total Loaned</p>
                <p className="text-xl font-bold">
                  <button onClick={changeCurrency} className="mr-1">
                    {currencies[currencyIndex]}
                  </button>
                  {totalLoaned.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm">Total Repaid</p>
                <p className="text-xl font-bold">
                  {currencies[currencyIndex]}
                  {totalRepaid.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm">Unpaid Loans</p>
                <p className="text-xl font-bold">
                  {currencies[currencyIndex]}
                  {(totalLoaned - totalRepaid).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm">Loans Taken / Repaid</p>
                <p className="text-xl font-bold">
                  {loans.length} / {loans.filter((loan) => loan.repaid).length}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Dialog open={isAddLoanOpen} onOpenChange={setIsAddLoanOpen}>
              <DialogTrigger asChild>
                <Button className="bg-amber-800 hover:bg-amber-900 text-white">
                  Add Loan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Loan</DialogTitle>
                </DialogHeader>
                <form onSubmit={addLoan} className="space-y-4">
                  <div>
                    <Label htmlFor="borrower">Borrower's Name</Label>
                    <Input id="borrower" required />
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" type="number" step="0.01" required />
                  </div>
                  <div>
                    <Label htmlFor="dateTaken">Date Loan Taken</Label>
                    <Input
                      id="dateTaken"
                      type="date"
                      max={getCurrentDate()}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateToRepay">Repay Date</Label>
                    <Input id="dateToRepay" type="date" required />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-amber-800 hover:bg-amber-900 text-white"
                  >
                    Add Loan
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-amber-800 hover:bg-amber-900 text-white">
                  All Loans
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] w-full max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle>All Loans</DialogTitle>
                </DialogHeader>
                <div className="overflow-auto flex-grow">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead
                          onClick={() => sortLoans("borrower")}
                          className="cursor-pointer"
                        >
                          Borrower
                        </TableHead>
                        <TableHead
                          onClick={() => sortLoans("amount")}
                          className="cursor-pointer"
                        >
                          Amount
                        </TableHead>
                        <TableHead
                          onClick={() => sortLoans("dateTaken")}
                          className="cursor-pointer"
                        >
                          Date Taken
                        </TableHead>
                        <TableHead
                          onClick={() => sortLoans("dateToRepay")}
                          className="cursor-pointer"
                        >
                          Repay Date
                        </TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getSortedLoans().map((loan) => (
                        <TableRow key={loan.id}>
                          <TableCell>{loan.borrower}</TableCell>
                          <TableCell>
                            {currencies[currencyIndex]}
                            {loan.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>{loan.dateTaken}</TableCell>
                          <TableCell>{loan.dateToRepay}</TableCell>
                          <TableCell>
                            {loan.repaid ? (
                              <Button
                                disabled
                                className="bg-gray-400 text-gray-600 cursor-not-allowed"
                              >
                                Paid
                              </Button>
                            ) : (
                              <Button
                                onClick={() => repayLoan(loan.id)}
                                className="bg-amber-800 hover:bg-amber-900 text-white"
                              >
                                Repay
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
