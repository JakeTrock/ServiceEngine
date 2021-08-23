import React from "react";

function DateBox(props) {
    const { visible, disabled, size, value, min, max } = props.objProps;
    const hookset = React.useRef(null);
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            Object.entries(ohooks).forEach(([key, value]) => {
                hookset.current.addEventListener(key, value);
            })
        }
    }, []);
    const id = props.uuid;
    const vis = (visible) ? "visible" : "hidden";
    return (
        <input type="datetime-local" id={id} ref={hookset} disabled={disabled} defaultValue={value} style={{ visibility: vis, fontSize: size }}
            min={min} max={max}></input>
    );
}

export default DateBox;
