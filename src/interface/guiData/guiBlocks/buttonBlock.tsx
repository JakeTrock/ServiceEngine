import React from "react";
import { toast } from "react-toastify";
import helpers from "../../data/helpers";

//a HTML button
function ButtonBlock(props) {
    const { visible, disabled, size, label } = props.objProps;
    const hookset = React.useRef(null);
    const id = props.uuid;
    //attach hooks to html
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, func]) => {
                switch (key) {
                    case "change":
                        hookset.current.addEventListener("click", ()=>(func as Function)({ value: label }))
                        break;
                    case "clickIn":
                        hookset.current.addEventListener("click", ()=>(func as Function)({ value: label }))
                        break;
                    case "doubleClickIn":
                        hookset.current.addEventListener("dblclick", ()=>(func as Function)({ value: label }))
                        break;
                    case "mouseIn":
                        hookset.current.addEventListener("mouseover", ()=>(func as Function)({ value: label }))
                        break;
                    case "mouseOut":
                        hookset.current.addEventListener("mouseout", ()=>(func as Function)({ value: label }))
                        break;
                    case "load":
                        (func as Function)({ value: label });
                        break;
                    default:
                        toast("invalid event type");
                }
            })
        }
    }, []);

    return (
        <button className="smbutton" id={id} ref={hookset} disabled={disabled} style={{ visibility: helpers.toggleVis(visible), fontSize: size || "1em" }}>{label}</button>
    );
}

export default ButtonBlock;