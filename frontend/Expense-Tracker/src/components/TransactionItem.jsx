import React from "react";

const TransactionItem = ({ t, onDelete, onEdit }) => {
  return (
    <div
      className="
        bg-white shadow-sm rounded-lg p-4
        flex flex-col gap-3
        sm:flex-row sm:items-center sm:justify-between
      "
    >
      {/* LEFT: Category + Date */}
      <div className="min-w-0">
        <p className="font-medium truncate">{t.category || "General"}</p>
        <p className="text-xs text-gray-500">
          {new Date(t.date).toLocaleDateString()}
        </p>
      </div>

      {/* MIDDLE: Amount + Note */}
      <div className="sm:text-right min-w-0">
        <p
          className={`font-semibold whitespace-nowrap ${
            t.type === "expense" ? "text-red-600" : "text-green-600"
          }`}
        >
          ₹ {t.amount}
        </p>
        {t.note && <p className="text-xs text-gray-500 truncate">{t.note}</p>}
      </div>

      {/* RIGHT: Actions */}
      <div className="flex justify-end gap-4 pt-2 sm:pt-0">
        <button
          onClick={() => onEdit?.(t)}
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete?.(t._id)}
          className="text-sm font-medium text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TransactionItem;
