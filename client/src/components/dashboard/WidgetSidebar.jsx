import React from 'react';
import {
  BarChart2, Table as TableIcon, Activity,
  PieChart, TrendingUp, MousePointer2
} from 'lucide-react';

const WidgetSidebar = ({ onAdd }) => {
  return (
    <aside className="w-80 bg-white border-r border-[#E2E8F0] p-8 overflow-y-auto">

      <div className="mb-10">
        <h3 className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] mb-2">
          Available Components
        </h3>
        <p className="text-xs text-[#64748B]">
          Drag and drop components to the canvas.
        </p>
      </div>

      {/* CHARTS */}
      <Section title="Charts" color="blue-500">
        <DraggableWidget type="Chart" title="Bar Chart" icon={<BarChart2 size={20} />} onAdd={onAdd}/>
        <DraggableWidget type="Chart" title="Line Chart" icon={<TrendingUp size={20} />} onAdd={onAdd}/>
        <DraggableWidget type="Chart" title="Pie Chart" icon={<PieChart size={20} />} onAdd={onAdd}/>
        <DraggableWidget type="Chart" title="Area Chart" icon={<Activity size={20} />} onAdd={onAdd}/>
        <DraggableWidget type="Chart" title="Scatter Plot" icon={<MousePointer2 size={20} />} onAdd={onAdd}/>
      </Section>

      {/* TABLE */}
      <Section title="Tables" color="amber-500">
        <DraggableWidget type="Table" title="Table" icon={<TableIcon size={20} />} onAdd={onAdd}/>
      </Section>

      {/* KPI */}
      <Section title="KPIs" color="green-500">
        <DraggableWidget type="KPI" title="KPI Value" icon={<TrendingUp size={20} />} onAdd={onAdd}/>
      </Section>

    </aside>
  );
};

const Section = ({ title, color, children }) => (
  <section className="mb-8">
    <h4 className="text-xs font-black uppercase mb-4 flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full bg-${color}`}></div>
      {title}
    </h4>
    <div className="grid gap-3">{children}</div>
  </section>
);

const DraggableWidget = ({ type, title, icon, onAdd }) => {

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("type", type);
        e.dataTransfer.setData("title", title);
      }}

      onClick={() => onAdd(type, title)}

      className="flex items-center gap-4 p-4 rounded-xl border hover:border-[#54bd95] cursor-grab active:cursor-grabbing transition"
    >
      <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl">
        {icon}
      </div>

      <span className="text-sm font-bold">{title}</span>
    </div>
  );
};

export default WidgetSidebar;