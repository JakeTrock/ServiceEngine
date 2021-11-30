import React from "react";
import { toast } from "react-toastify";
import helpers from "../../../../data/helpers";

function OneChoice(props) {
    const { visible, size, disabled, value, labels, required } = props.objProps;
    const hookset = React.useRef(null);

    //attach hooks to html
    React.useEffect(() => {
        if (value && labels.indexOf(value) < 0) {
            toast("your default value must be contained in labels!");
            return;
        }
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, func]) => {
                switch (key) {
                    case "change": hookset.current.addEventListener("change", (e) => (func as Function)({
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
                            value: e.target.value || value
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
                            value: e.target.value || value
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
                            value: e.target.value || value
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
                            value: e.target.value || value
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
                            value: e.target.value || value
                        })
                    }); break;
                    case "load": (func as Function)({ value: labels[value as number] }); break;
                    case "keyPressed": hookset.current.addEventListener("click", (e) => {
                        e.preventDefault();
                        return (func as Function)({
                            key: e.keyCode,
                            shift: e.shiftKey,
                            value: e.target.value || value
                        })
                    }); break;
                    case "scroll": hookset.current.addEventListener("wheel", (e) => {
                        e.preventDefault();
                        const x = e.deltaX;
                        const y = e.deltaY;
                        return (func as Function)({
                            x,
                            y,
                            value: e.target.value || value
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
        <select id={id} required={required} ref={hookset} disabled={disabled} defaultValue={value} style={{ visibility: helpers.toggleVis(visible), fontSize: size || "1em" }}>
            {!value && <option value={null}>none</option>}
            {labels && labels.map((lbl, i) => (
                <option key={i} value={lbl}>{lbl}</option>
            ))}
        </select>
    );
}

export default OneChoice;
