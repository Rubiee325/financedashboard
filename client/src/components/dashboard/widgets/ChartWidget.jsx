import React, { useMemo } from "react";
import {
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  PieChart, Pie,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Legend
} from "recharts";
const ChartWidget = ({ widget, orders = [] }) => {
  const { config } = widget;
  const {
    chartType = "",
    xAxis = "Product",
    yAxis = "Total Amount",
    color = "#54bd95",
    showLegend = true
  } = config;
  const type = (chartType || "").toLowerCase();
  const fieldMap = {
    "Customer Name": "firstName",
    "Product": "product",
    "Quantity": "quantity",
    "Unit Price": "unitPrice",
    "Total Amount": "totalAmount",
    "Status": "status",
    "Created By": "createdBy"
  };
  const chartData = useMemo(() => {

  if (!orders.length) return [];

  const grouped = {};

  orders.forEach(t => {

    const key = t.category || "Other";

    if (!grouped[key]) {
      grouped[key] = { name: key, value: 0 };
    }

    grouped[key].value += Number(t.amount) || 0;

  });

  return Object.values(grouped);

}, [orders]);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white border rounded shadow">
          <p className="text-xs font-bold">{label}</p>
          <p className="font-bold">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };
  const colors = [
    color,
    "#6366f1",
    "#f59e0b",
    "#f43f5e",
    "#8b5cf6"
  ];
  const renderXAxis = () => (
    <XAxis
      dataKey="name"
      interval={0}
      height={50}
      tick={{ fontSize: 11 }}
      tickFormatter={(value) =>
        value.length > 12 ? value.slice(0, 12) + "..." : value
      }
    />
  );
  if (type.includes("bar")) {
    return (
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            {renderXAxis()}
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill={color} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  if (type.includes("line")) {
    return (
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            {renderXAxis()}
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  if (type.includes("area")) {
    return (
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            {renderXAxis()}
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" stroke={color} fill={color} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
  if (type.includes("pie")) {
    return (
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={90}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            {showLegend && <Legend />}
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
  if (type.includes("scatter")) {
    const scatterData = chartData.map((d, i) => ({
      x: i + 1,
      y: d.value,
      name: d.name
    }));
    return (
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <ScatterChart>
            <CartesianGrid />
            <XAxis dataKey="x" />
            <YAxis dataKey="y" />
            <Tooltip />
            <Scatter data={scatterData} fill={color} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
  }
  return <div className="text-center py-10">Unsupported chart</div>;
};
export default ChartWidget;