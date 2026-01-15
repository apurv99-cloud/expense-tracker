import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import API_PATH from "../../utils/apiPath";
import TransactionItem from "../../components/TransactionItem";

import {
  FaMoneyBillWave,
  FaPlusCircle,
  FaCalendarAlt,
  FaPen,
  FaTags,
  FaListAlt,
  FaDownload,
} from "react-icons/fa";

const Expense = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    category: "",
    date: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch all expenses
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATH.EXPENSE.GET_ALL_EXPENSE);
      setList(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Add expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        amount: Number(form.amount),
        category: form.category,
        date: new Date(form.date),
        note: form.note,
      };

      await axiosInstance.post(API_PATH.EXPENSE.ADD_EXPENSE, payload);
      setForm({ amount: "", category: "", date: "", note: "" });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to add expense");
    }
  };

  // Delete expense
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(API_PATH.EXPENSE.DELETE_EXPENSE(id));
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Download Excel
  const handleDownload = async () => {
    try {
      const res = await axiosInstance.get(API_PATH.EXPENSE.DOWNLOAD_EXPENSE, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expenses.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
      alert("Failed to download file");
    }
  };

  return (
    <>
      {/* PAGE TITLE */}
      <h2 className="flex items-center gap-3 text-2xl font-bold mb-6">
        <FaMoneyBillWave className="text-[#875cf5]" />
        Expenses
      </h2>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* ADD EXPENSE */}
        <div className="p-8 rounded-3xl bg-white shadow-lg">
          <h3 className="flex items-center gap-3 font-semibold text-xl mb-6">
            <FaPlusCircle className="text-[#875cf5]" />
            Add Expense
          </h3>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Amount */}
            <div className="relative">
              <FaMoneyBillWave className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Amount"
                required
                className="w-full border border-gray-200 pl-12 pr-4 py-4 rounded-xl text-base
                           focus:outline-none focus:ring-2 focus:ring-[#875cf5]"
              />
            </div>

            {/* Category */}
            <div className="relative">
              <FaTags className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
                required
                className="w-full border border-gray-200 pl-12 pr-4 py-4 rounded-xl text-base
                           focus:outline-none focus:ring-2 focus:ring-[#875cf5]"
              />
            </div>

            {/* Date */}
            <div className="relative">
              <FaCalendarAlt className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 pl-12 pr-4 py-4 rounded-xl text-base
                           focus:outline-none focus:ring-2 focus:ring-[#875cf5]"
              />
            </div>

            {/* Note */}
            <div className="relative">
              <FaPen className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Note (optional)"
                className="w-full border border-gray-200 pl-12 pr-4 py-4 rounded-xl text-base
                           focus:outline-none focus:ring-2 focus:ring-[#875cf5]"
              />
            </div>

            {/* Add Button */}
            <button
              type="submit"
              className="mt-2 bg-[#875cf5] hover:bg-[#7347f0]
                         text-white py-4 rounded-xl font-semibold
                         transition text-base flex items-center justify-center gap-2"
            >
              <FaPlusCircle />
              Add Expense
            </button>
          </form>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="mt-6 w-full bg-green-500 hover:bg-green-600
                       text-white py-4 rounded-xl font-semibold
                       transition flex items-center justify-center gap-2"
          >
            <FaDownload />
            Download Expense Excel
          </button>
        </div>

        {/* EXPENSE HISTORY */}
        <div className="p-8 rounded-3xl bg-white shadow-lg">
          <h3 className="flex items-center gap-3 font-semibold text-xl mb-6">
            <FaListAlt className="text-[#875cf5]" />
            Expense History
          </h3>

          <div className="flex flex-col gap-4">
            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : list.length === 0 ? (
              <p className="text-sm text-gray-500">No expenses added yet.</p>
            ) : (
              list.map((item) => (
                <TransactionItem
                  key={item._id}
                  t={item}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Expense;
