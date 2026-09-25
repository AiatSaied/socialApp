import React from "react";

export default function Footer() {
  return (
    // <div className="bg-gray-300 p-3 fixed bottom-0 w-full">
    //   <h1>Footer</h1>
    // </div>
    <footer className="bg-white border-t border-gray-200 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-bold text-gray-800">Social App</h2>
            <p className="text-sm text-gray-500 mt-1">
              Connect, share, and stay connected.
            </p>
          </div>
        </div>
        {/* Copyright */}
        <div className="border-t border-gray-100 mt-5 pt-4 text-center">
          <p className="text-xs sm:text-sm text-gray-400">
            © {new Date().getFullYear()} Social App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
