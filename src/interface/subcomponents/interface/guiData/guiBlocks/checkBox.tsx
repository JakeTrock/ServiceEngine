import React from "react";
import { toast } from "react-toastify";
import helpers from "../../../../data/helpers";

function CheckBox(props) {
    const { visible, disabled, value } = props.objProps;
    const [onOff, setOnOff] = React.useState<boolean>(value || false);
    const hookset = React.useRef(null);

    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && Object.getOwnPropertyNames(ohooks).includes("change")) {
            return (ohooks["change"] as Function)({
                value: onOff
            })
        }
    }, [onOff]);
    //attach hooks to html
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, func]) => {
                switch (key) {
                    case "change": break;
                    case "clickIn": hookset.current.addEventListener("click", (e) => {
                        e.preventDefault();
                        return (func as Function)({
                            value: onOff
                        })
                    }); break;
                    case "doubleClickIn": hookset.current.addEventListener("dblclick", (e) => {
                        e.preventDefault();
                        return (func as Function)({
                            value: onOff
                        })
                    }); break;
                    case "clickOut": hookset.current.addEventListener("blur", (e) => {
                        e.preventDefault();
                        return (func as Function)({
                            value: onOff
                        })
                    }); break;
                    case "mouseIn": hookset.current.addEventListener("mouseover", (e) => {
                        e.preventDefault();
                        return (func as Function)({
                            value: onOff
                        })
                    }); break;
                    case "mouseOut": hookset.current.addEventListener("mouseout", (e) => {
                        e.preventDefault();
                        return (func as Function)({
                            value: onOff
                        })
                    }); break;
                    case "load": (func as Function)({ value: onOff }); break;
                    default:
                        toast("invalid event type");
                }
            })
        }
    }, [onOff]);
    const id = props.uuid;

    return (
        <input type="checkbox" id={id} defaultChecked={onOff} disabled={disabled} onClick={() => setOnOff(v => !v)} ref={hookset} style={{ visibility: helpers.toggleVis(visible) }} />
    );
}

export default CheckBox;
