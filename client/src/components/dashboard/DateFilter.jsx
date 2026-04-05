import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const DateFilter = ({ value, onChange }) => {
  const options = [
    'All time',
    'Today',
    'Last 7 Days',
    'Last 30 Days',
    'Last 90 Days'
  ];

  return (
    <div className="relative group">
        <div className="flex items-center gap-3 bg-white border border-[#E2E8F0] pl-5 pr-4 py-3.5 rounded-2xl shadow-sm group-hover:border-[#54bd95]/50 transition-all cursor-pointer">
            <Calendar size={18} className="text-[#54bd95]" />
            <div className="flex flex-col">
                <span className="text-[10px] text-[#94A3B8] font-black uppercase tracking-widest leading-none mb-1">Time Range</span>
                <div className="flex items-center gap-2">
                    <select 
                        value={value} 
                        onChange={(e) => onChange(e.target.value)}
                        className="bg-transparent text-sm text-[#0F172A] font-black outline-none cursor-pointer appearance-none min-w-[100px]"
                    >
                        {options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="text-[#94A3B8]" />
                </div>
            </div>
        </div>
    </div>
  );
};

export default DateFilter;
