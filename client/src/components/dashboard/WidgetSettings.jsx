import React, { useState, useEffect } from 'react';
import { X, ChevronRight, LayoutGrid } from 'lucide-react';
import WidgetPreview from './WidgetPreview';

const WidgetSettings = ({ widget, onClose, onUpdate }) => {

  const [formData, setFormData] = useState({
    title: widget.title,
    description: widget.description || '',
    w: widget.w,
    h: widget.h,
    config: { ...widget.config } // FIXED
  });

  // FIX: update state when another widget is selected
  useEffect(() => {

    setFormData({
      title: widget.title,
      description: widget.description || '',
      w: widget.w,
      h: widget.h,
      config: { ...widget.config }
    });

  }, [widget]);

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    if (name === "w" || name === "h") {

      setFormData(prev => ({
        ...prev,
        [name]: Number(value)
      }));

    }

    else if (name.startsWith("config.")) {

      const key = name.split(".")[1];

      setFormData(prev => ({
        ...prev,
        config: {
          ...prev.config,
          [key]: type === "checkbox" ? checked : value
        }
      }));

    }

    else {

      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

    }

  };

  const handleApply = (e) => {

    e.preventDefault();

    const updatedConfig = { ...formData.config };

    onUpdate(
      widget.id,
      updatedConfig,
      {
        title: formData.title,
        description: formData.description,
        w: formData.w,
        h: formData.h
      }
    );

    onClose();

  };

  const metrics = [
    'Customer ID',
    'Customer Name',
    'Email ID',
    'Phone Number',
    'Address',
    'Order ID',
    'Order Date',
    'Product',
    'Quantity',
    'Unit Price',
    'Total Amount',
    'Status',
    'Created By'
  ];

  const numericMetrics = ['Total Amount','Unit Price','Quantity'];

  return (

    <div className="fixed inset-0 z-[200] flex overflow-hidden">

      {/* LEFT PANEL */}
      <div
        className="flex-1 bg-black/10 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* SETTINGS PANEL */}
      <div className="relative w-[380px] bg-white flex flex-col shadow-2xl">

        <div className="p-8 border-b flex justify-between items-center">

          <div>

            <h2 className="text-2xl font-black">
              Widget Configuration
            </h2>

            <p className="text-[10px] uppercase tracking-widest text-gray-400">
              Type: {widget.type}
            </p>

          </div>

          <button onClick={onClose}>
            <X size={20}/>
          </button>

        </div>

        <form onSubmit={handleApply} className="flex-1 overflow-y-auto p-8 space-y-8">

          {/* TITLE */}

          <InputGroup
            label="Widget Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          {/* SIZE */}

          <div className="grid grid-cols-2 gap-4">

            <InputGroup
              label="Width"
              name="w"
              type="number"
              value={formData.w}
              onChange={handleChange}
            />

            <InputGroup
              label="Height"
              name="h"
              type="number"
              value={formData.h}
              onChange={handleChange}
            />

          </div>

          {/* KPI SETTINGS */}

          {widget.type === "KPI" && (

            <>
              <SelectGroup
                label="Metric"
                name="config.metric"
                value={formData.config.metric}
                options={metrics}
                onChange={handleChange}
              />

              <SelectGroup
                label="Aggregation"
                name="config.aggregation"
                value={formData.config.aggregation}
                options={
                  numericMetrics.includes(formData.config.metric)
                    ? ["Sum","Average","Count"]
                    : ["Count"]
                }
                onChange={handleChange}
              />
              <InputGroup
                  label="Decimal Precision"
                  name="config.precision"
                  type="number"
                  value={formData.config.precision || 0}
                  onChange={handleChange}
              />
              </>
          )}

          {/* CHART SETTINGS */}

          {widget.type === "Chart" && (

            <>
              <SelectGroup
                label="X Axis"
                name="config.xAxis"
                value={formData.config.xAxis}
                options={metrics}
                onChange={handleChange}
              />

              <SelectGroup
                label="Y Axis"
                name="config.yAxis"
                value={formData.config.yAxis}
                options={metrics}
                onChange={handleChange}
              />
            </>

          )}

          {/* TABLE SETTINGS */}

          {widget.type === "Table" && (

            <MultiSelectGroup
              label="Columns"
              selected={formData.config.columns || []}
              options={metrics}
              onChange={(cols) =>
                setFormData(prev => ({
                  ...prev,
                  config: {
                    ...prev.config,
                    columns: cols
                  }
                }))
              }
            />

          )}

        </form>

        {/* FOOTER */}

        <div className="p-8 border-t flex gap-4">

          <button
            onClick={onClose}
            className="flex-1 border px-6 py-3 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={handleApply}
            className="flex-1 bg-[#54bd95] text-white px-6 py-3 rounded-xl"
          >
            Save Changes
          </button>

        </div>

      </div>

      {/* PREVIEW PANEL */}

      <div className="flex-1 bg-white border-l">
        <WidgetPreview formData={formData} type={widget.type}/>
      </div>

    </div>

  );

};

const InputGroup = ({ label, name, value, onChange, type="text" }) => (

  <div>

    <label className="text-xs font-bold block mb-2">
      {label}
    </label>

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-xl px-4 py-3"
    />

  </div>

);

const SelectGroup = ({ label, name, value, options, onChange }) => (

  <div>

    <label className="text-xs font-bold block mb-2">
      {label}
    </label>

    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-xl px-4 py-3"
    >

      {options.map(o => (
        <option key={o} value={o}>{o}</option>
      ))}

    </select>

  </div>

);

const MultiSelectGroup = ({ label, options, selected, onChange }) => (

  <div>

    <label className="text-xs font-bold block mb-3">
      {label}
    </label>

    {options.map(o => (

      <label key={o} className="flex gap-2 mb-2">

        <input
          type="checkbox"
          checked={selected.includes(o)}
          onChange={(e)=>{

            const next = e.target.checked
              ? [...selected,o]
              : selected.filter(x=>x!==o);

            onChange(next);

          }}
        />

        {o}

      </label>

    ))}

  </div>

);

export default WidgetSettings;