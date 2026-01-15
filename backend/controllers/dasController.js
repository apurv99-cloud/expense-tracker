const mongoose = require("mongoose");
const Income = require("../models/Income");
const Expense = require("../models/Expense");

exports.getDashboardData = async (req, res) => {
  const userId = req.user.id;

  try {
    // === Total Income Aggregate ===
    const totalIncomeResult = await Income.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalIncome = totalIncomeResult[0]?.total || 0;

    // === Total Expense Aggregate ===
    const totalExpenseResult = await Expense.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalExpense = totalExpenseResult[0]?.total || 0;

    // Last 60 Days Income Transactions
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const last60DaysIncomeTransactions = await Income.find({
      userId,
      date: { $gte: sixtyDaysAgo },
    }).sort({ date: -1 });

    //  Last 30 Days Expense Transactions
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const last30DaysExpenseTransactions = await Expense.find({
      userId,
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: -1 });

    // === Total Expenses in last 30 days ===
    const expensesLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // === Fetch last 5 transactions (income + expense) ===
    const lastIncomeTransactions = await Income.find({ userId })
      .sort({ date: -1 })
      .limit(5)
      .lean()
      .exec();
    const formattedIncome = lastIncomeTransactions.map((txn) => ({
      ...txn,
      type: "income",
    }));

    const lastExpenseTransactions = await Expense.find({ userId })
      .sort({ date: -1 })
      .limit(5)
      .lean()
      .exec();
    const formattedExpense = lastExpenseTransactions.map((txn) => ({
      ...txn,
      type: "expense",
    }));

    // Combine and sort all, then take most recent 5 only
    const lastTransactions = [...formattedIncome, ...formattedExpense]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    res.json({
      totalBalance:
        (totalIncomeResult[0]?.total || 0) -
        (totalExpenseResult[0]?.total || 0),
      totalIncome: totalIncomeResult[0]?.total || 0,
      totalExpenses: totalExpenseResult[0]?.total || 0,
      Last30DaysExpenses: {
        total: expensesLast30Days,
        transactions: last30DaysExpenseTransactions,
      },
      last60DaysIncome: {
        total: last60DaysIncomeTransactions.reduce(
          (sum, txn) => sum + txn.amount,
          0
        ),
        transactions: last60DaysIncomeTransactions,
      },
      recentTransactions: lastTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
