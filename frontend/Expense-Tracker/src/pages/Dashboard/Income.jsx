import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import API_PATH from "../../utils/apiPath";
import TransactionItem from "../../components/TransactionItem";

import {
  FaMoneyBillWave,
  FaPlusCircle,
  FaCalendarAlt,
  FaPen,
  FaListAlt,
} from "react-icons/fa";

const Income = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    source: "",
    date: "",
    note: "",
  });

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get(API_PATH.INCOME.GET_ALL_INCOME);
      setList(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(API_PATH.INCOME.ADD_INCOME, form);
      setForm({ amount: "", source: "", date: "", note: "" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    await axiosInstance.delete(API_PATH.INCOME.DELETE_INCOME(id));
    fetchData();
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
      {/* ADD INCOME */}
      <div className="p-8 rounded-3xl bg-white shadow-lg">
        <h3 className="flex items-center gap-3 font-semibold text-xl mb-6">
          <FaPlusCircle className="text-[#875cf5]" />
          Add Income
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
              className="w-full border border-gray-200 pl-12 pr-4 py-4 rounded-xl text-base
                         focus:outline-none focus:ring-2 focus:ring-[#875cf5]"
            />
          </div>

          {/* Source */}
          <div className="relative">
            <FaPen className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              name="source"
              value={form.source}
              onChange={handleChange}
              placeholder="Source"
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

          {/* Button */}
          <button
            type="submit"
            className="mt-2 bg-[#875cf5] hover:bg-[#7347f0]
                       text-white py-4 rounded-xl font-semibold
                       transition text-base flex items-center justify-center gap-2"
          >
            <FaPlusCircle />
            Add Income
          </button>
        </form>
      </div>

      {/* INCOME LIST */}
      <div className="p-8 rounded-3xl bg-white shadow-lg">
        <h3 className="flex items-center gap-3 font-semibold text-xl mb-6">
          <FaListAlt className="text-[#875cf5]" />
          Income History
        </h3>

        <div className="flex flex-col gap-4">
          {list.length === 0 ? (
            <p className="text-gray-500 text-sm">No income added yet.</p>
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
  );
};

export default Income;
