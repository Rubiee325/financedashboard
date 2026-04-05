import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ChevronLeft, Settings, Trash2, LayoutGrid } from "lucide-react";

import WidgetSidebar from "./WidgetSidebar";
import WidgetSettings from "./WidgetSettings";
import WidgetPreview from "./WidgetPreview";

import { saveDashboardConfig, getDashboardConfig } from "../../services/api";

const ConfigCanvas = () => {

  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [widgets, setWidgets] = useState([]);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // ✅ NEW: drag state for placeholder effect
  const [isDragging, setIsDragging] = useState(false);

  /* ================= LOAD ================= */

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await getDashboardConfig();
        const loadedWidgets = response?.data?.data?.widgets || [];
        setWidgets(loadedWidgets);
      } catch (error) {
        console.error("Dashboard load failed", error);
      }
    };

    loadConfig();
  }, []);

  /* ================= ADD ================= */

  const handleAddWidget = (type, title) => {

    const newWidget = {
      id: `widget-${Date.now()}-${Math.random()}`,
      type: type.includes("Chart") ? "Chart" : type,
      title: title || "Untitled",

      config: {
        chartType: type === "Chart" ? title : null,
        metric: "Total Amount",
        aggregation: "Sum",
        dataFormat: "Number",
        precision: 0,
        xAxis: "Product",
        yAxis: "Total Amount",
        color: "#54bd95",
        showLabel: false,
        showLegend: true,
        columns: ["Customer Name", "Product", "Total Amount", "Status"],
        sortBy: "Order Date",
        pagination: "10",
        fontSize: 14,
        headerBg: "#54bd95",
        showFilters: false
      }
    };

    setWidgets(prev => {
      const updated = [...prev, newWidget];

      // scroll to canvas
      setTimeout(() => {
        canvasRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 100);

      return updated;
    });
  };

  /* ================= UPDATE ================= */

  const updateWidget = (id, config, extra = {}) => {
    setWidgets(prev =>
      prev.map(w =>
        w.id === id
          ? { ...w, ...extra, config: { ...w.config, ...config } }
          : w
      )
    );
  };

  /* ================= DELETE ================= */

  const deleteWidget = (id) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    try {
      await saveDashboardConfig({ widgets });
      navigate("/dashboard");
    } catch (error) {
      console.error("Save failed", error);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans">

      {/* HEADER */}
      <header className="h-20 bg-white border-b px-10 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/")}
            className="p-3 hover:bg-gray-100 rounded-xl"
          >
            <ChevronLeft size={22} />
          </button>

          <div>
            <h2 className="text-2xl font-black text-[#0F172A]">
              Studio
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-gray-400">
              Dashboard Builder
            </p>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className="flex flex-1 flex-col md:flex-row">

        {/* SIDEBAR */}
        <div className="w-full md:w-[280px]">
          <WidgetSidebar onAdd={handleAddWidget} />
        </div>

        {/* CANVAS */}
        <div className="flex-1 p-4 md:p-8">

          <div
            ref={canvasRef}
            className={`grid grid-cols-1 md:grid-cols-2 gap-6 border-2 border-dashed rounded-xl p-2 transition
              ${isDragging ? "border-[#54bd95] bg-[#54bd95]/5" : "border-transparent"}
            `}

            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}

            onDrop={(e) => {
              setIsDragging(false);

              const type = e.dataTransfer.getData("type");
              const title = e.dataTransfer.getData("title");

              if (type) {
                handleAddWidget(type, title);
              }
            }}
          >

            {widgets.map((widget, index) => (

              <div
                key={widget.id || widget._id || index}
                className="bg-white rounded-3xl border flex flex-col min-h-[320px] md:h-[420px]"
              >

                {/* HEADER */}
                <div className="p-4 border-b flex justify-between">
                  <h4 className="text-xs font-bold truncate">
                    {widget.title}
                  </h4>

                  <div className="flex gap-2">

                    <button
                      onClick={() => {
                        setSelectedWidget(widget);
                        setIsSettingsOpen(true);
                      }}
                    >
                      <Settings size={16} />
                    </button>

                    <button onClick={() => deleteWidget(widget.id)}>
                      <Trash2 size={16} />
                    </button>

                  </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1 p-4 overflow-auto">
                  <WidgetPreview widget={widget} />
                </div>

              </div>

            ))}

          </div>

          {/* EMPTY STATE */}
          {widgets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40">
              <LayoutGrid size={60} className="text-gray-200 mb-6" />
              <p className="text-gray-400 font-bold uppercase text-xs">
                Drag widgets from sidebar
              </p>
            </div>
          )}

        </div>

      </div>

      {/* SAVE BUTTON */}
      <div className="fixed bottom-4 right-4 md:bottom-10 md:right-10 z-50">
        <button
          onClick={handleSave}
          className="bg-[#54bd95] text-white px-10 py-4 rounded-full font-bold flex gap-2 items-center"
        >
          <Save size={18}/> Save Dashboard
        </button>
      </div>

      {/* SETTINGS */}
      {isSettingsOpen && selectedWidget && (
        <WidgetSettings
          widget={selectedWidget}
          onClose={() => setIsSettingsOpen(false)}
          onUpdate={updateWidget}
        />
      )}

    </div>
  );
};

export default ConfigCanvas;