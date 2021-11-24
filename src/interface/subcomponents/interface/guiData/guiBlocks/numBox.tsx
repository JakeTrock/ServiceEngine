import React from "react";
import { toast } from "react-toastify";
import helpers from "../../../../data/helpers";

function NumBox(props) {
    const { visible, disabled, size, value, min, max, step, required } = props.objProps;
    const hookset = React.useRef(null);

    const validate = (e) => {
        const val = e.target.value;
        const badVal = val < min || val > max;
        const catchall = !e.target.checkValidity();
        if (badVal) {
            hookset.current.value = min;
            toast(`The value of this numberbox is limited to between ${min || 0} and ${max} characters`)
        } else if (catchall) {
            hookset.current.value = min;
            toast('Misc. validation error on numberbox. Try using the arrows on the side.')
        }
    }

    //attach hooks to html
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, func]) => {
                switch (key) {
                    case "change": hookset.current.addEventListener("change", () => (ohooks["change"] as Function)({
                        value: hookset.current.value,
                    })); break;
                    case "clickIn": hookset.current.addEventListener("click", (e) => {
                        e.preventDefault();
                        const bcr = hookset.current!.getBoundingClientRect();
                        const x = e.pageX - bcr.right;
                        const y = e.pageY - bcr.top;
                        return (func as Function)({
                            x,
                            y,
                            value: hookset.current.value
                        })
                    }); break;
                    case "doubleClickIn": hookset.current.addEventListener("dblclick", (e) => {
                        e.preventDefault();
                        const bcr = hookset.current!.getBoundingClientRect();
                        const x = e.pageX - bcr.right;
                        const y = e.pageY - bcr.top;
                        return (func as Function)({
                            x,
                            y,
                            value: hookset.current.value
                        })
                    }); break;
                    case "clickOut": hookset.current.addEventListener("blur", (e) => {
                        e.preventDefault();
                        const bcr = hookset.current!.getBoundingClientRect();
                        const x = e.pageX - bcr.right;
                        const y = e.pageY - bcr.top;
                        return (func as Function)({
                            x,
                            y,
                            value: hookset.current.value
                        })
                    }); break;
                    case "mouseIn": hookset.current.addEventListener("mouseover", (e) => {
                        e.preventDefault();
                        const bcr = hookset.current!.getBoundingClientRect();
                        const x = e.pageX - bcr.right;
                        const y = e.pageY - bcr.top;
                        return (func as Function)({
                            x,
                            y,
                            value: hookset.current.value
                        })
                    }); break;
                    case "mouseOut": hookset.current.addEventListener("mouseout", (e) => {
                        e.preventDefault();
                        const bcr = hookset.current!.getBoundingClientRect();
                        const x = e.pageX - bcr.right;
                        const y = e.pageY - bcr.top;
                        return (func as Function)({
                            x,
                            y,
                            value: hookset.current.value
                        })
                    }); break;
                    case "load": (func as Function)({ value }); break;
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
        <input type="number" id={id} disabled={disabled} onChange={validate} required={required} step={step} ref={hookset} style={{ visibility: helpers.toggleVis(visible), fontSize: size }} min={min} max={max} defaultValue={value} />
    );
}

export default NumBox;
