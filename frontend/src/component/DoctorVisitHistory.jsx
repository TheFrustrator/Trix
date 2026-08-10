import React from "react";
import { FaCalendarAlt } from "react-icons/fa";

const formatShort = (isoDateStr) => {
  if (!isoDateStr) return "";
  const d = new Date(isoDateStr);
  if (isNaN(d.getTime())) return isoDateStr;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

const formatFull = (isoDateStr) => {
  if (!isoDateStr) return "N/A";
  const d = new Date(isoDateStr);
  if (isNaN(d.getTime())) return isoDateStr;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const getInitials = (name) => {
  if (!name) return "DR";
  const parts = name.replace(/^Dr\.?\s*/i, "").trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
};

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
];

const monthsBetween = (startIso, endDate) => {
  if (!startIso) return 0;
  const start = new Date(startIso);
  if (isNaN(start.getTime())) return 0;
  const months =
    (endDate.getFullYear() - start.getFullYear()) * 12 +
    (endDate.getMonth() - start.getMonth());
  return Math.max(months, 0);
};

const DoctorVisitHistory = ({
  visits = [],
  totalVisits = 0,
  avgGapDays = null,
  therapyStartDate = null,
  selectedVisitId,
  setSelectedVisitId,
  loading = false,
}) => {
  const today = new Date();

  if (loading) {
    return (
      <div className="w-full bg-white border rounded-2xl p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Doctor Visit History</h2>
        <p className="text-sm text-slate-400">Loading visit history...</p>
      </div>
    );
  }

  if (!visits.length) {
    return (
      <div className="w-full bg-white border rounded-2xl p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-2">Doctor Visit History</h2>
        <p className="text-sm text-slate-500">No visits recorded yet.</p>
      </div>
    );
  }

  const monthsSpan = monthsBetween(therapyStartDate, today);

  return (
    <div className="w-full bg-white border rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <h2 className="text-lg font-bold text-slate-800">Doctor Visit History</h2>
        <div className="bg-slate-50 border rounded-xl px-4 py-2 text-xs text-slate-600 flex flex-col sm:flex-row gap-1 sm:gap-4">
          <span>
            Total Visits: <span className="font-bold text-slate-800">{totalVisits}</span>
          </span>
          {avgGapDays !== null && (
            <span>
              Avg. Gap Between Visits: <span className="font-bold text-slate-800">{avgGapDays} days</span>
            </span>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative w-full overflow-x-auto pb-2">
        <div className="relative flex items-center justify-between min-w-[600px] px-4">
          {/* connecting line */}
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200" />

          {visits.map((visit, idx) => {
            const isSelected = selectedVisitId === visit.id;
            const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
            return (
              <div
                key={visit.id}
                className="relative z-10 flex flex-col items-center gap-2 cursor-pointer group"
                onClick={() => setSelectedVisitId?.(visit.id)}
              >
                <span className="text-xs font-semibold text-slate-700">
                  {formatShort(visit.date)}
                </span>
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${color} ${
                    isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-white shadow-sm"
                  }`}
                  title={`${visit.doctorName} — ${visit.diagnosis}`}
                >
                  {getInitials(visit.doctorName)}
                </div>
                <span className="text-[11px] text-slate-500 max-w-[80px] text-center truncate">
                  {visit.doctorName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer labels */}
      <div className="flex justify-between items-center mt-4 text-xs text-slate-600">
        <span>
          Therapy Start — <span className="font-bold">{formatFull(therapyStartDate)}</span>
        </span>
        <span>
          Today — <span className="font-bold">{formatFull(today.toISOString())}</span>
        </span>
      </div>

      {/* Selected visit detail */}
      {selectedVisitId && (
        <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-slate-700">
          {(() => {
            const v = visits.find((x) => x.id === selectedVisitId);
            if (!v) return null;
            return (
              <>
                <span className="font-bold">{formatFull(v.date)}</span> — {v.doctorName} ({v.clinic}):{" "}
                {v.diagnosis}
              </>
            );
          })()}
        </div>
      )}

      <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center gap-2 text-xs text-slate-600">
        <FaCalendarAlt size={12} />
        <span>
          {totalVisits} visit{totalVisits === 1 ? "" : "s"}
          {monthsSpan > 0 ? ` in the last ${monthsSpan} month${monthsSpan === 1 ? "" : "s"}` : ""}
        </span>
      </div>
    </div>
  );
};

export default DoctorVisitHistory;