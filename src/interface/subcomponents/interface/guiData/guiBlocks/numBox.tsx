import React from "react";
import { toast } from "react-toastify";

function NumBox(props) {
    const { visible, disabled, size, value, min, max, step, required } = props.objProps;
    const hookset = React.useRef(null);
    //attach hooks to html
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, value]) => {
                hookset.current.addEventListener(key, (e) => {
                    const val = e.target.value;
                    const badVal = val < min || val > max;
                    const catchall = !e.target.checkValidity();
                    if (badVal) {
                        hookset.current.value = min;
                        toast(`The value of this numberbox is limited to between ${min || 0} and ${max} characters`)
                    } else if (catchall) {
                        hookset.current.value = min;
                        toast('Misc. validation error on numberbox. Try using the arrows on the side.')
                    } else return (value as Function)({ value: Number(val) });
                });
            })
        }
    }, []);
    const id = props.uuid;
    const vis = (visible === false) ? "hidden" : "visible";
    return (
        <input type="number" id={id} disabled={disabled} required={required} step={step} ref={hookset} style={{ visibility: vis, fontSize: size }} min={min} max={max} defaultValue={value} />
    );
}

export default NumBox;
