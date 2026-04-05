import React, { useState } from "react";

const TableWidget = ({ orders = [], role }) => {

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = orders.filter(t => {
  const text = search.toLowerCase();

  const matchesSearch =
    t.category?.toLowerCase().includes(text) ||
    t.type?.toLowerCase().includes(text) ||
    String(t.amount).includes(text) ||
    new Date(t.date).toLocaleDateString().includes(text);

  const matchesType = typeFilter ? t.type === typeFilter : true;

  return matchesSearch && matchesType;
});

  return (
    <div>

      <div className="flex gap-3 mb-4">

        <input
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded"
        />

       <select
  onChange={(e) => setTypeFilter(e.target.value)}
  className="border px-3 py-2 rounded text-black bg-white"
>
          <option value="">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        

      </div>

      {/* ✅ FIX: prevent hiding */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 whitespace-nowrap">Date</th>
              <th className="px-4 py-2 whitespace-nowrap">Amount</th>
              <th className="px-4 py-2 whitespace-nowrap">Category</th>
              <th className="px-4 py-2 whitespace-nowrap">Type</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((t, i) => (
              <tr key={i} className="border-b">

                <td className="px-4 py-2 whitespace-nowrap">
                  {new Date(t.date).toLocaleDateString()}
                </td>

                <td className="px-4 py-2 whitespace-nowrap">
                  ₹{t.amount}
                </td>

                <td className="px-4 py-2 whitespace-nowrap">
                  {t.category}
                </td>

                <td
                  className={`px-4 py-2 whitespace-nowrap ${
                    t.type === "expense"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {t.type}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default TableWidget;