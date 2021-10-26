import React from "react";

function Slider(props) {//can be optimized i reckon
    const { visible, disabled, width, value, min, max, step } = props.objProps;
    const hookset = React.useRef(null);
    const [cval, setCval] = React.useState<string>(value);
    //attach hooks to html
    React.useEffect(() => {
        const ohooks = props.objHooks;
        hookset.current.addEventListener("change", v => setCval(v.target.value))
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
        <div style={{display:'flex'}}>
            <input type="range" id={id} disabled={disabled} ref={hookset} style={{ visibility: vis, width }} min={min} max={max} step={step} defaultValue={value} />
            {cval}
            </div>
    );
}

export default Slider;
