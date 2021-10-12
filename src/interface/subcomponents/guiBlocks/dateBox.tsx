import React from "react";

function DateBox(props) {
    const { visible, disabled, size, value, min, max, required } = props.objProps;
    const hookset = React.useRef(null);
    //attach hooks to html
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, value]) => {
                hookset.current.addEventListener(key, value);
            })
        }
    }, []);
    const id = props.uuid;
    const vis = (visible) ? "visible" : "hidden";
    return (
        <input type="datetime-local" id={id} ref={hookset} disabled={disabled} defaultValue={value} style={{ visibility: vis, fontSize: size }}
            min={min} max={max} required={required}></input>
    );
}

export default DateBox;
