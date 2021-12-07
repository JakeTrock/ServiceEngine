import React from "react";
import { ToastContainer } from "react-toastify";
import logo from "../../images/logo.svg";

//top navbar
function TopBar(props) {
  return (
    <>
      <nav className="bg-white shadow-lg">
        
        <div className="md:flex items-center justify-between py-2 px-8 md:px-12">
          <div className="text-2xl font-bold text-gray-800 md:text-3xl">
            <a href="/"><img
              alt="ServiceEngine Logo"
              src={logo}
            /></a>
          </div>

          <div className="flex flex-col md:flex-row hidden md:block -mx-2">
            <a href="/about" className="text-gray-800 rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium py-2 px-2 md:mx-2">About</a>
            <a href="/all" className="text-gray-800 rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium py-2 px-2 md:mx-2">All</a>
            <a href="/profile" className="text-gray-800 rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium py-2 px-2 md:mx-2">My Profile</a>
          </div>
        </div>
      </nav>

      <ToastContainer />
    </>
  );
}

export default TopBar;
