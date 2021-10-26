import React from "react";
import { toast } from "react-toastify";

function Slider(props) {//can be optimized i reckon
    const { visible, disabled, width, value, min, max, step } = props.objProps;
    const { badRange } = props.validate;
    const hookset = React.useRef(null);
    //attach hooks to html
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, value]) => {
                hookset.current.addEventListener(key, (e) => {
                    const cval = e.target.value;
                    const rangeViolation = badRange ? badRange.find(r => cval > r[0] && cval < r[1]) : undefined;//TODO:should this be made inclusive?
                    if (rangeViolation !== undefined) {
                        hookset.current.value = value;
                        toast.error(`your selection must not be between values ${rangeViolation}`);
                    } else return (value as Function)({ value: cval });
                });
            })
        }
    }, []);//badRange: [[2,3],[7,9]],
    const id = props.uuid;
    const vis = (visible) ? "visible" : "hidden";

    return (
        <div style={{display:'flex'}}><input type="range" id={id} disabled={disabled} ref={hookset} style={{ visibility: vis, width }} min={min} max={max} step={step} defaultValue={value} onChange={e => { 
            //@ts-ignore
            e.currentTarget.parentNode.childNodes.item(1).innerHTML=e.target.value }} /><p>{value}</p></div>
    );
}

export default Slider;
