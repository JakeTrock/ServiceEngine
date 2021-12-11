import * as React from "react";
import './data/styles.css';
import logo from "./images/logo.svg";

const Welcome = () => {
    return (
        <div className="flex bg-white" style={{ height: "60em" }}>
            <div className="flex items-center text-center lg:text-left px-8 md:px-12 lg:w-1/2">
                <div>
                    <img src={logo} alt="Sengine Logo" />
                    <h2 className="text-3xl font-semibold text-gray-800 md:text-4xl">Convert it with <span className="text-indigo-600">SEngine</span></h2>
                    <p className="mt-2 text-sm text-gray-500 md:text-base">SEngine is a quick way to convert files online, and to make converters in just a few clicks.</p>
                    <div className="flex justify-center lg:justify-start mt-6">
                        <a className="px-4 py-3 bg-gray-900 text-gray-200 text-xs font-semibold rounded hover:bg-gray-800" href="/all">Get Started</a>
                        <a className="mx-4 px-4 py-3 bg-gray-300 text-gray-900 text-xs font-semibold rounded hover:bg-gray-400" href="/about">Learn More</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
