import React, { useState } from "react";
import "../../../data/styles_custom/switch.css";

function ToggleSwitch(props) {
  const [isToggled, setIsToggled] = useState(false);
  const onToggle = () => setIsToggled(!isToggled);
  return (
    <div className="switchwrap">
      {isToggled ? props.labelT : props.labelF}
      <label className="switch">
        <input type="checkbox" checked={isToggled} onChange={onToggle} />
        <span className="slider" />
      </label>
    </div>
  );
}
export default ToggleSwitch;
