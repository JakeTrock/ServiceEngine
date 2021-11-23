import React from "react";
import { toast } from "react-toastify";
import helpers from "../../../../data/helpers";

function TextBlock(props) {
    const { visible, size, label } = props.objProps;
    const hookset = React.useRef(null);
    //attach hooks to html
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, func]) => {
                switch (key) {
                    case "clickIn": hookset.current.addEventListener("click", (e) => {
                        e.preventDefault();
                        return (func as Function)({ value: label })
                    }); break;
                    case "doubleClickIn": hookset.current.addEventListener("dblclick", (e) => {
                        e.preventDefault();
                        return (func as Function)({ value: label })
                    }); break;
                    case "mouseIn": hookset.current.addEventListener("mouseover", (e) => {
                        e.preventDefault();
                        return (func as Function)({ value: label })
                    }); break;
                    case "load": (func as Function)({ value: label }); break;
                    default:
                        toast("invalid event type");
                }
            })
        }
    }, []);
    const id = props.uuid;

    return (
        <p id={id} ref={hookset} style={{ visibility: helpers.toggleVis(visible), fontSize: size || "1em" }}>{label}</p>
    );
}

export default TextBlock;