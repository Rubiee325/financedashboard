import React from "react";

const KPIWidget = ({ widget, orders = [] }) => {

  if (!orders.length) {
    return <div className="text-center text-gray-400">No data</div>;
  }

  const income = orders
    .filter(t => (t.type || "expense") === "income")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const expense = orders
    .filter(t => (t.type || "expense") === "expense")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const balance = income - expense;

  let value = 0;

  const title = widget.title?.toLowerCase() || "";

  if (title.includes("income")) value = income;
  else if (title.includes("expense")) value = expense;
  else if (title.includes("balance")) value = balance;
  else value = balance;

  return (
    <div className="flex flex-col justify-center h-full">

      {/* ✅ FIX: always visible */}
      <h2 className="text-4xl font-black text-gray-900 dark:text-white">
        ₹{Math.round(value || 0)}
      </h2>

      {/* ✅ Better label visibility */}
      <p className="text-xs uppercase text-gray-300 mt-2">
        {widget.title}
      </p>

    </div>
  );
};

export default KPIWidget;