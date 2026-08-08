import React from "react";
import { useLocation } from "react-router-dom";
import { Icons } from "./../assets/assets";

const NavlinkComponent = ({ handlePageChange, userNavlinkItem }) => {
  const location = useLocation();

  return (
    <aside className="flex flex-col items-center fixed h-full bg-blue-100 border border-blue-100 shadow-sm">
      {/* Logo and Name Section */}
      <div className="flex flex-row items-center my-8 mx-8 gap-1">
        <img className="w-10" src={Icons.logoM} alt="MediLink Logo" />
        <h1 className="text-2xl text-primary font-semibold">MediLink</h1>
      </div>

      {/* Pages Section */}
      <div className="flex flex-col gap-3">
        {userNavlinkItem.map((item) => {
          const isActive =
            item.route === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.route);

          return (
            <button
              key={item.key || item.route}
              onClick={() => handlePageChange(item)}
              className={`flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-300 shadow-xs border-blue-400 font-bold"
                  : "hover:border-blue-300 hover:bg-blue-200"
              }`}
            >
              <div className="flex flex-row items-center gap-2">
                <span className="object-contain border-none rounded-lg">
                  {item.icon}
                </span>
                <h3 className="font-semibold text-primary text-sm">
                  {item.title}
                </h3>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default NavlinkComponent;
