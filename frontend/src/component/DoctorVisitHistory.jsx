import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { visitHistoryData } from '../assets/patientAssests';



export default function DoctorVisitHistory() {
  const [selectedVisitId, setSelectedVisitId] = useState(5);

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 p-6 shadow-sm font-sans mx-auto">
      
      {/* Header Section */}
      <div className="flex items-start justify-between mb-12">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Doctor Visit History
        </h2>

        {/* Stats Card */}
        <div className="bg-slate-50 border border-slate-100/80 rounded-xl px-4 py-2.5 text-right space-y-1">
          <div className="text-sm text-slate-600">
            Total Visits: <span className="font-bold text-slate-900 ml-1">6</span>
          </div>
          <div className="text-sm text-slate-600">
            Avg. Gap Between Visits: <span className="font-bold text-slate-900 ml-1">45 days</span>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="relative my-10 px-6">
        
        {/* Gray Base Line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-2.5 bg-slate-200/80 rounded-full" />

        {/* Timeline Nodes */}
        <div className="relative flex items-center justify-between z-10">
          {visitHistoryData.map((visit) => {
            const isSelected = visit.id === selectedVisitId;

            return (
              <div 
                key={visit.id} 
                onClick={() => setSelectedVisitId(visit.id)}
                className="relative flex flex-col items-center cursor-pointer group"
              >
                {/* Date Label & Line */}
                <div className="absolute -top-10 flex flex-col items-center">
                  <span className={`text-xs font-semibold tracking-wide transition-colors ${
                    isSelected ? 'text-slate-900 font-bold' : 'text-slate-800 group-hover:text-sky-600'
                  }`}>
                    {visit.date}
                  </span>
                  <div className={`w-[2px] h-3 mt-1 transition-colors ${
                    isSelected ? 'bg-sky-500' : 'bg-slate-400'
                  }`} />
                </div>

                {/* Node Style handling (Selected vs Default) */}
                {isSelected ? (
                  <div className="p-1 rounded-full bg-sky-100 ring-4 ring-sky-200 transition-all">
                    <div className="w-12 h-12 rounded-full bg-white border-2 border-sky-500 shadow-md flex items-center justify-center overflow-hidden">
                      {visit.type === 'avatar' ? (
                        <img 
                          src={visit.avatarUrl} 
                          alt={visit.doctorName} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="text-sky-600 font-bold text-sm">{visit.label}</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-slate-300 shadow-md flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                    {visit.type === 'avatar' ? (
                      <img 
                        src={visit.avatarUrl} 
                        alt={visit.doctorName} 
                        className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" 
                      />
                    ) : (
                      <span className="text-slate-700 font-semibold text-sm">{visit.label}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Date Range Sub-Bar */}
      <div className="flex justify-between items-center text-sm font-medium text-slate-800 mb-6">
        <div>
          <span className="text-slate-600 font-normal">Therapy Start — </span>
          <span className="font-bold">02 Jan 2026</span>
        </div>
        <div>
          <span className="text-slate-600 font-normal">Today — </span>
          <span className="font-bold">30 Jul 2026</span>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="bg-slate-50 border border-slate-100/80 rounded-xl p-3.5 flex items-center gap-3 text-slate-800 font-semibold text-sm">
        <Calendar className="w-5 h-5 text-slate-600" />
        <span>6 visits in the last 10 months</span>
      </div>

    </div>
  );
}