const xlsx = require("xlsx");
const Expense = require("../models/Expense");
const path = require("path");
const fs = require("fs");

// ✅ ADD EXPENSE
const addExpense = async (req, res) => {
  try {
    const userId = req.user.id; // 🔥 REQUIRED
    const { category, amount, date, note } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newExpense = new Expense({
      userId,
      category,
      amount,
      date: new Date(date),
      note,
    });

    await newExpense.save();

    res.status(201).json({
      success: true,
      expense: newExpense,
    });
  } catch (error) {
    console.error("Add Expense Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ✅ GET ALL EXPENSE
const getAllExpense = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    res.status(200).json({ data: expenses });
  } catch (error) {
    console.error("Get Expense Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ DELETE EXPENSE
const deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete Expense Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ DOWNLOAD EXCEL
const downloadExpenseExcel = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    const data = expenses.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date.toISOString().split("T")[0],
      Note: item.note || "",
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expenses");

    const filePath = path.join(__dirname, `expense_${userId}.xlsx`);
    xlsx.writeFile(wb, filePath);

    res.download(filePath, () => fs.unlinkSync(filePath));
  } catch (error) {
    console.error("Download Excel Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpenseExcel,
};
