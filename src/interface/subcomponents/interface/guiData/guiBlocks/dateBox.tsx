import React from "react";
import { toast } from "react-toastify";

function DateBox(props) {
    const { visible, disabled, size, value, min, max, required } = props.objProps;
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
                        toast(`The value of this datebox is limited to between date ${min || 0} and ${max}`)
                    } else if (catchall) {
                        hookset.current.value = min;
                        toast('Misc. validation error on datebox. Try using the calendar picker.')
                    } else return (value as Function)({ value: val });
                });
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
