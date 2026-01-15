import React, { useEffect, useState, useCallback, useMemo } from "react";
import SummaryCard from "../../components/SummaryCard";
import TransactionItem from "../../components/TransactionItem";
import axiosInstance from "../../utils/axiosInstance";
import API_PATH from "../../utils/apiPath";

import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaChartBar,
  FaChartPie,
} from "react-icons/fa";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#875cf5", "#22c55e", "#facc15", "#ef4444", "#06b6d4"];

const Home = () => {
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);
  const [refresh, setRefresh] = useState(false); // 🔥 KEY

  // 🔥 Stable fetch function
  const fetchData = useCallback(async () => {
    try {
      const [incRes, expRes] = await Promise.all([
        axiosInstance.get(API_PATH.INCOME.GET_ALL_INCOME),
        axiosInstance.get(API_PATH.EXPENSE.GET_ALL_EXPENSE),
      ]);

      setIncome(incRes.data.data || incRes.data || []);
      setExpense(expRes.data.data || expRes.data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // 🔥 Re-fetch when refresh changes
  useEffect(() => {
    fetchData();
  }, [fetchData, refresh]);

  const total = (list) =>
    list.reduce((sum, i) => sum + Number(i.amount || 0), 0);

  const totalIncome = total(income);
  const totalExpense = total(expense);
  const balance = totalIncome - totalExpense;

  // 🔥 Memoized category aggregation (better performance)
  const pieData = useMemo(() => {
    const catMap = {};
    expense.forEach((e) => {
      const c = e.category || "Other";
      catMap[c] = (catMap[c] || 0) + Number(e.amount || 0);
    });

    return Object.keys(catMap).map((k) => ({
      name: k,
      value: catMap[k],
    }));
  }, [expense]);

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SummaryCard
          title="Total Income"
          amount={totalIncome}
          icon={<FaArrowUp />}
          color="green"
        />
        <SummaryCard
          title="Total Expense"
          amount={totalExpense}
          icon={<FaArrowDown />}
          color="red"
        />
        <SummaryCard
          title="Balance"
          amount={balance}
          icon={<FaWallet />}
          color="purple"
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Expenses */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white shadow-md">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FaChartBar className="text-[#875cf5]" />
            Monthly Expenses
          </h3>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={expense.map((e) => ({
                  name: new Date(e.date).toLocaleDateString(),
                  value: Number(e.amount),
                }))}
              >
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#875cf5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie */}
        <div className="p-6 rounded-3xl bg-white shadow-md">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FaChartPie className="text-[#875cf5]" />
            By Category
          </h3>

          <div className="h-[260px]">
            {pieData.length === 0 ? (
              <p className="text-gray-400 text-sm text-center mt-20">
                No expense data
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" outerRadius={90} label>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="mt-8">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FaWallet className="text-[#875cf5]" />
          Recent Transactions
        </h3>

        <div className="grid gap-3">
          {[...income, ...expense].slice(0, 6).map((t) => (
            <TransactionItem
              key={t._id}
              t={t}
              onChange={() => setRefresh((p) => !p)} // 🔥 IMPORTANT
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
