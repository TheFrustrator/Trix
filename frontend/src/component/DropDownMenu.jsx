import React, { useState, useEffect, useRef } from 'react';

const DropDownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Last 6 Months');
  const dropdownRef = useRef(null);

  const options = ['Last 30 Days', 'Last 3 Months', 'Last 6 Months', 'Last Year'];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full h-2 relative inline-block font-sans my-2" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-[#f7f9fc] hover:bg-[#f1f5f9] border rounded-lg border-[#e1e8f0]  text-[#1e293b] text-base font-normal transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-100"
      >
        {/* Calendar Icon */}
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>

        <span className='text-xs'>{selectedOption}</span>

        {/* Chevron Icon */}
        <svg
          className={`w-4 h-4 text-[#3b82f6] transition-transform duration-200 ml-1 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Menu List */}
      {isOpen && (
        <ul className="absolute left-0 top-full mt-2 min-w-full bg-white border border-[#e2e8f0] rounded-2xl shadow-lg p-1.5 z-10 space-y-1">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                setSelectedOption(option);
                setIsOpen(false);
              }}
              className={`px-3 py-2 rounded-xl text-xs cursor-pointer whitespace-nowrap transition-colors ${
                selectedOption === option
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropDownMenu;