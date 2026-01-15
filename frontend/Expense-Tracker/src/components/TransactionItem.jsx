import React from "react";

const TransactionItem = ({ t, onDelete, onEdit }) => {
  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-white shadow-sm">
      <div>
        <p className="font-medium">{t.category || "General"}</p>
        <p className="text-xs text-gray-500">
          {new Date(t.date).toLocaleDateString()}
        </p>
      </div>
      <div className="text-right">
        <p
          className={`font-semibold ${
            t.type === "expense" ? "text-red-600" : "text-green-600"
          }`}
        >
          ₹ {t.amount}
        </p>
        <p className="text-xs text-gray-500">{t.note || ""}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onEdit?.(t)} className="text-sm text-indigo-600">
          Edit
        </button>
        <button
          onClick={() => onDelete?.(t._id)}
          className="text-sm text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TransactionItem;
