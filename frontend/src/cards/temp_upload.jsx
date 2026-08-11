import React, { useState, useRef } from "react";

const HandleUploadCard = ({
  uploadLicense,
  setUploadLicense,
  isDragging,
  fileInputRef,
  handleDragLeave,
  handleDragOver,
  handleDrop,
  handleFileChange,
  valueUser,
}) => {
  return (
    <div className="w-full my-2 flex flex-col gap-1.5">
      <p className="text-sm font-semibold text-[#264067]">
        Upload {valueUser} License
      </p>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
      />

      {/* Drag & Drop UI Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
          isDragging
            ? "border-gray-100 bg-blue-50/50"
            : "border-gray-100 bg-white hover:bg-gray-50/80 hover:border-[#7BBCE7]"
        }`}
      >
        {/* Upload Icon */}
        <div className="w-10 h-10 mb-2 rounded-full bg-blue-50 flex items-center justify-center text-[#5B9BD5]">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        {uploadLicense ? (
          <div className="flex items-center gap-2 text-sm text-[#264067] font-medium">
            <span className="truncate max-w-[200px]">{uploadLicense.name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setUploadLicense(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="text-xs text-red-500 hover:underline ml-2"
            >
              Remove
            </button>
          </div>
        ) : (
          <p className="text-sm font-medium text-gray-600 text-center">
            Drag and drop or{" "}
            <span className="text-[#5B9BD5] font-semibold hover:underline">
              browse
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default HandleUploadCard;
