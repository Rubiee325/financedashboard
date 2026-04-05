import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getOrders } from '../../services/api';

import {
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  ScatterChart, Scatter,
  PieChart, Pie,
  Legend,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const WidgetPreview = ({ widget, formData, type }) => {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await getOrders();
        setOrders(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Orders load failed", err);
      }
    };

    loadOrders();
  }, []);

  const data = widget || formData;
  const widgetType = widget?.type || type;

  if (!data) return null;

  const config = data.config || {};

  const chartColor = config.color || '#54bd95';
  const chartType = config.chartType;

  const fieldMap = {
  "Customer ID": "_id",

  "Customer Name": "firstName",
  "Customer name": "firstName",

  "Email ID": "email",
  "Phone Number": "phone",

  "Order ID": "_id",
  "Order Date": "createdAt",

  "Product": "product",

  "Quantity": "quantity",

  "Unit Price": "unitPrice",

  "Total Amount": "totalAmount",
  "Total amount": "totalAmount",

  "Status": "status",

  "Created By": "createdBy"
};

  const buildChartData = () => {

    if (!orders.length) return [];

    const xKey = fieldMap[config.xAxis] || "product";
    const yKey = fieldMap[config.yAxis] || "totalAmount";

    const grouped = {};

    orders.forEach(order => {

      const key =
        xKey === "firstName"
          ? `${order.firstName || ""} ${order.lastName || ""}`
          : order[xKey] || "Unknown";

      if (!grouped[key]) {
        grouped[key] = {
          x: key,
          y: 0
        };
      }

      grouped[key].y += Number(order[yKey] || 0);

    });

    return Object.values(grouped);
  };

  const chartData = buildChartData();

  /* ================= KPI ================= */

  if (widgetType === 'KPI') {

    let value = 0;
    const metricKey = fieldMap[config.metric] || "totalAmount";

    if (config.aggregation === "Count") {
      value = orders.length;
    }

    if (config.aggregation === "Sum") {
      value = orders.reduce((sum, o) => sum + (Number(o[metricKey]) || 0), 0);
    }

    if (config.aggregation === "Average") {
      value =
        orders.length === 0
          ? 0
          : orders.reduce((sum, o) => sum + (Number(o[metricKey]) || 0), 0) /
            orders.length;
    }

    return (
      <div className="flex flex-col h-full bg-[#F8FAFC] p-8 overflow-y-auto">

        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94A3B8] mb-10">
          Live Preview
        </h3>

        <div className="flex-1 flex items-center justify-center">

          <motion.div
            layout
            className="bg-white rounded-[2.5rem] border border-[#E2E8F0] shadow-lg p-10 w-full max-w-sm"
          >

            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#64748B] mb-3">
              {data.title || 'Untitled'}
            </p>

            <h2 className="text-5xl font-black text-[#0F172A] tracking-tighter">
              {config.dataFormat === 'Currency' ? '$' : ''}
              {Math.round(value)}
            </h2>

          </motion.div>

        </div>
      </div>
    );
  }

  /* ================= TABLE ================= */

  if (widgetType === 'Table') {

    const columns = config.columns || [];

    return (
      <div className="flex flex-col h-full bg-[#F8FAFC] p-8 overflow-y-auto">

        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94A3B8] mb-10">
          Live Preview
        </h3>

        <div className="flex-1 flex items-center justify-center">

          <motion.div
            layout
            className="bg-white rounded-[2.5rem] border border-[#E2E8F0] shadow-lg overflow-hidden w-full max-w-2xl"
          >

            <div className="p-6 border-b">
              <h4 className="text-lg font-black text-[#0F172A]">
                {data.title || 'Untitled'}
              </h4>
            </div>

            <table className="w-full">

              <thead style={{ backgroundColor: config.headerBg || '#54bd95' }}>
                <tr>
                  {columns.map(col => (
                    <th key={col} className="px-4 py-3 text-white text-xs uppercase">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>

                {orders.slice(0,5).map((order,i)=>(
                  <tr key={i} className="border-b">

                    {columns.map(col => {

                      const field = fieldMap[col];

                      let value =
                        col === "Customer Name"
                          ? `${order.firstName || ""} ${order.lastName || ""}`
                          : order[field];

                      if (col === "Order Date" && value) {
                        value = new Date(value).toLocaleDateString();
                      }

                      if (col === "Total Amount") {
                        value = `$${value}`;
                      }

                      return (
                        <td key={col} className="px-4 py-3 text-sm">
                          {value || "—"}
                        </td>
                      );

                    })}

                  </tr>
                ))}

              </tbody>

            </table>

          </motion.div>

        </div>
      </div>
    );
  }

 /* ================= CHART ================= */

if (widgetType === 'Chart') {

  return (

    <div className="flex flex-col h-full bg-[#F8FAFC] p-8 overflow-y-auto">

      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94A3B8] mb-10">
        Live Preview
      </h3>

      <div className="flex-1 flex items-center justify-center min-h-[350px]">

        <motion.div
          layout
          className="bg-white rounded-[2.5rem] border border-[#E2E8F0] shadow-lg p-6 w-full max-w-2xl h-[400px]"
        >

          <h4 className="text-lg font-black text-[#0F172A] mb-4">
            {data.title || 'Untitled'}
          </h4>

          {/* ✅ FIX: ensure container always has size */}
          <div style={{ width: "100%", height: "300px", minHeight: 300 }}>

           
  <div style={{ width: "100%", height: 320 }}>

  <ResponsiveContainer width="100%" height="100%">

              {chartType === 'Bar Chart' && (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="x"/>
                  <YAxis/>
                  <Tooltip/>
                  <Bar dataKey="y" fill={chartColor}/>
                </BarChart>
              )}

              {chartType === 'Line Chart' && (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="x"/>
                  <YAxis/>
                  <Tooltip/>
                  <Line type="monotone" dataKey="y" stroke={chartColor}/>
                </LineChart>
              )}

              {chartType === 'Area Chart' && (
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="x"/>
                  <YAxis/>
                  <Tooltip/>
                  <Area type="monotone" dataKey="y" stroke={chartColor} fill={chartColor}/>
                </AreaChart>
              )}

              {chartType === 'Scatter Plot' && (
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="x"/>
                  <YAxis dataKey="y"/>
                  <Tooltip/>
                  <Scatter data={chartData} fill={chartColor}/>
                </ScatterChart>
              )}

              {chartType === 'Pie Chart' && (
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="y"
                    nameKey="x"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {chartData.map((entry,index)=>(
                      <Cell
                        key={index}
                        fill={[
                          '#54bd95',
                          '#6366f1',
                          '#f59e0b',
                          '#ef4444',
                          '#8b5cf6'
                        ][index % 5]}
                      />
                    ))}
                  </Pie>

                  <Tooltip/>
                  {config.showLegend && <Legend/>}

                </PieChart>
              )}

            </ResponsiveContainer>
            </div>

          </div>

        </motion.div>

      </div>

    </div>
  );
}
  return null;
};

export default WidgetPreview;