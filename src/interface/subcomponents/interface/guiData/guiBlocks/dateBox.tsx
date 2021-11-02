import React from "react";
import { toast } from "react-toastify";
const validDate = /^(([0-9]{4})((-[0-9]{2}){2}(( |T)?([0-9]{2}:){2}[0-9]{2}((\+[0-9]{2}(:[0-9]{2})?)|Z)?)?|(-W[0-9]{2}(-[1-7])?)|(-[1-3]?[0-9]{2})))$/;

function DateBox(props) {
    const { visible, disabled, size, value, min, max, required } = props.objProps;
    const hookset = React.useRef(null);
    if (validDate.test(value)) { toast("Improperly formatted value!"); }
    if (validDate.test(min)) { toast("Improperly formatted min!"); }
    if (validDate.test(max)) { toast("Improperly formatted max!"); }
    //attach hooks to html
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, value]) => {
                hookset.current.addEventListener(key, (e) => {
                    const val = e.target.value;
                    const minDt = new Date(min).getTime();
                    const maxDt = new Date(max).getTime();
                    const valDt = new Date(val).getTime();
                    const badVal = valDt < minDt || valDt > maxDt;
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
