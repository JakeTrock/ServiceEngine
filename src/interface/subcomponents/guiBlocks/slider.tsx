import React from "react";

function Slider(props) {
    const { visible, disabled, width, value, min, max } = props.objProps;
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
        <input type="range" id={id} disabled={disabled} ref={hookset} style={{ visibility: vis, width }} min={min} max={max} defaultValue={value} />
    );
}

export default Slider;
