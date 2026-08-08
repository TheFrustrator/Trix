import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRoles } from "../assets/assets";


const handleChooseRole = ({handleRoleChange}) => {
   const navigate = useNavigate();

  const [isSlidebarOpen, setIsSlidebarOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("patient");
  return(
<>
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
            {loginRoles.map((role) => {
              const isActive = selectedRole === role.key;
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
                  <img src={role.icon} alt={role.title} className="w-10 h-10 object-contain" />
                  <div>
                    <h3 className="font-bold text-[#264067] text-sm">{role.title}</h3>
                    <p className="text-xs text-gray-500">Switch context to {role.key}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
       
      </aside>
</>
  ) 
};

export default handleChooseRole;
