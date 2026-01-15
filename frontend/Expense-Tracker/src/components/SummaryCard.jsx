import React from "react";

const SummaryCard = ({ title, amount, change, className }) => (
  <div className={`p-4 rounded-2xl bg-white shadow-sm ${className}`}>
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-2xl font-bold mt-1">
      ₹ {amount?.toLocaleString?.() ?? 0}
    </h3>
    {typeof change !== "undefined" && (
      <p
        className={`text-xs mt-1 ${
          change >= 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {change >= 0 ? "+" : ""}
        {change}%
      </p>
    )}
  </div>
);

export default SummaryCard;
