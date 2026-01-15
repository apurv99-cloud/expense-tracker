import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import API_PATH from "../../utils/apiPath";
import TransactionItem from "../../components/TransactionItem";

import {
  FaListAlt,
  FaSearch,
  FaArrowUp,
  FaArrowDown,
  FaFilter,
} from "react-icons/fa";

const Transactions = () => {
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);
  const [filter, setFilter] = useState("all"); // all | income | expense
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incRes, expRes] = await Promise.all([
          axiosInstance.get(API_PATH.INCOME.GET_ALL_INCOME),
          axiosInstance.get(API_PATH.EXPENSE.GET_ALL_EXPENSE),
        ]);

        setIncome(incRes.data.data || []);
        setExpense(expRes.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Combine + sort
  const allTransactions = [...income, ...expense]
    .map((t) => ({
      ...t,
      type: t.source ? "income" : "expense",
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Apply filter + search
  const filteredTransactions = allTransactions.filter((t) => {
    if (filter !== "all" && t.type !== filter) return false;

    if (search) {
      const text = `${t.category || ""} ${t.source || ""} ${
        t.note || ""
      }`.toLowerCase();
      return text.includes(search.toLowerCase());
    }
    return true;
  });

  const totalIncome = income.reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalExpense = expense.reduce((s, e) => s + Number(e.amount || 0), 0);

  return (
    <>
      {/* PAGE HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <FaListAlt className="text-[#875cf5] text-xl" />
        <h2 className="text-2xl font-bold">Transactions</h2>
      </div>

      {/* SUMMARY BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="text-xl font-semibold">{allTransactions.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow">
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <FaArrowUp className="text-green-500" />
            Total Income
          </p>
          <p className="text-xl font-semibold text-green-600">
            ₹ {totalIncome}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow">
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <FaArrowDown className="text-red-500" />
            Total Expense
          </p>
          <p className="text-xl font-semibold text-red-600">₹ {totalExpense}</p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-2xl p-5 shadow mb-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-400" />
          {["all", "income", "expense"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition
                ${
                  filter === f
                    ? "bg-[#875cf5] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="w-full border border-gray-200 pl-11 pr-4 py-3 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-[#875cf5]"
          />
        </div>
      </div>

      {/* TRANSACTION LIST */}
      <div className="bg-white rounded-3xl shadow p-6">
        {filteredTransactions.length === 0 ? (
          <p className="text-gray-500 text-sm">No transactions found.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredTransactions.map((t) => (
              <TransactionItem key={t._id} t={t} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Transactions;
