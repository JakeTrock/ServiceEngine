import React from "react";

function Slider(props) {
    const { visible, disabled, width, value, min, max } = props.objProps;
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
        <input type="range" id={id} disabled={disabled} ref={hookset} style={{ visibility: vis, width }} min={min} max={max} defaultValue={value} />
    );
}

export default Slider;
