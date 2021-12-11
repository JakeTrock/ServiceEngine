import React from "react";
import { toast } from "react-toastify";
import helpers from "../../data/helpers";
const validDate = /^(([0-9]{4})((-[0-9]{2}){2}(( |T)?([0-9]{2}:){2}[0-9]{2}((\+[0-9]{2}(:[0-9]{2})?)|Z)?)?|(-W[0-9]{2}(-[1-7])?)|(-[1-3]?[0-9]{2})))$/;

function DateBox(props) {
    const { visible, disabled, size, value, min, max, required } = props.objProps;
    const hookset = React.useRef(null);
    if (validDate.test(value)) { toast("Improperly formatted value!"); }
    if (validDate.test(min)) { toast("Improperly formatted min!"); }
    if (validDate.test(max)) { toast("Improperly formatted max!"); }
    const validate = (e) => {
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
        }
    }

    //attach hooks to html
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, func]) => {
                switch (key) {
                    case "change": hookset.current.addEventListener("change", () => (func as Function)({
                        value: hookset.current.value
                    })); break;
                    case "clickIn": hookset.current.addEventListener("click", (e) => {
                        e.preventDefault();
                        return (func as Function)({
                            value: hookset.current.value
                        })
                    }); break;
                    case "doubleClickIn": hookset.current.addEventListener("dblclick", (e) => {
                        e.preventDefault();
                        return (func as Function)({
                            value: hookset.current.value
                        })
                    }); break;
                    case "clickOut": hookset.current.addEventListener("blur", (e) => {
                        e.preventDefault();
                        return (func as Function)({
                            value: hookset.current.value
                        })
                    }); break;
                    case "mouseIn": hookset.current.addEventListener("mouseover", (e) => {
                        e.preventDefault();
                        return (func as Function)({
                            value: hookset.current.value
                        })
                    }); break;
                    case "mouseOut": hookset.current.addEventListener("mouseout", (e) => {
                        e.preventDefault();
                        return (func as Function)({
                            value: hookset.current.value
                        })
                    }); break;
                    case "load": (func as Function)({}); break;
                    case "keyPressed": hookset.current.addEventListener("click", (e) => {
                        e.preventDefault();
                        return (func as Function)({
                            key: e.keyCode,
                            shift: e.shiftKey,
                            value: hookset.current.value
                        })
                    }); break;
                    case "scroll": hookset.current.addEventListener("wheel", (e) => {
                        e.preventDefault();
                        const x = e.deltaX;
                        const y = e.deltaY;
                        return (func as Function)({
                            x,
                            y,
                            value: hookset.current.value
                        })
                    }); break;
                    default:
                        toast("invalid event type");
                }
            })
        }
    }, []);
    const id = props.uuid;

    return (
        <input type="datetime-local" id={id} ref={hookset} disabled={disabled} onChange={validate} defaultValue={value} style={{ visibility: helpers.toggleVis(visible), fontSize: size || "1em" }}
            min={min} max={max} required={required}></input>
    );
}

export default DateBox;