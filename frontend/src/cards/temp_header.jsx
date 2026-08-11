import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Icons, signupRole } from "../assets/assets";

const UserSighUpHeader = ({ isSlidebarOpen, setIsSlidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Find the active role based on the current URL pathname
  const currentRoleObj = signupRole.find(
    (r) => r.route === location.pathname
  ) || signupRole[0]; // Fallback to first role if path doesn't match

  

  const handleRoleChange = (signupRole) => {
    setIsSlidebarOpen(false);
    if (signupRole.route && signupRole.route !== location.pathname) {
      navigate(signupRole.route);
    }
  };

  return (
    <div className="flex flex-row justify-between items-center px-8 py-4">
      {/* Logo */}
      <div 
        className="flex flex-row items-center cursor-pointer" 
        onClick={() => navigate("/")}
      >
        <img className="w-10 rounded-full" src={Icons.logoM} alt="MediLink Logo" />
        <h1 className="ml-2 text-2xl font-bold text-primary">MediLink</h1>
      </div>

      {/* Role Indicator & Sidebar Trigger */}
      <div className="flex items-center gap-3">
        <div className="px-5 py-2 bg-white rounded-xl shadow-sm border border-gray-200 text-sm font-semibold text-[#264067]">
          Signup in as {currentRoleObj?.title?.replace("For ", "")}
        </div>

        <button
          onClick={() => setIsSlidebarOpen(true)}
          className="text-sm font-semibold text-blue-300 hover:underline cursor-pointer"
        >
          Change role
        </button>
      </div>

      {/* Dark Overlay Backdrop */}
      <div
        onClick={() => setIsSlidebarOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 z-40 ${
          isSlidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out p-6 flex flex-col justify-between ${
          isSlidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          {/* Sidebar Top Header */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-[#264067]">Select Role</h2>
            <button
              onClick={() => setIsSlidebarOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 text-lg cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Role Options List */}
          <div className="flex flex-col gap-3">
            {signupRole.map((role) => {
              const isActive = currentRoleObj?.key === role.key;
              return (
                <button
                  key={role.key}
                  onClick={() => handleRoleChange(role)}
                  className={`flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? "border-[#5B9BD5] bg-blue-50/50 shadow-xs"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <img
                    src={role.icon}
                    alt={role.title}
                    className="w-10 h-10 object-contain"
                  />
                  <div>
                    <h3 className="font-bold text-[#264067] text-sm">
                      {role.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Switch context to {role.key}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default UserSighUpHeader;