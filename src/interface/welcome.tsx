import * as React from "react";
import './data/styles.css';
import selogo from "./images/selogo.png";
const Welcome = () => {
    return (
        <div style={{ textAlign: "center" }}>
            <h1>Welcome to Sengine!</h1>
            <a id ="sma" href="/all">
                <h2>Start Converting!</h2>
            </a><br />
            <img src={selogo} alt="Logo" />
        </div>
    );
};

export default Welcome;
