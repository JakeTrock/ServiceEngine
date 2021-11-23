import React from "react";
import { toast } from "react-toastify";
import helpers from "../../../../data/helpers";
import { compDict } from "../compDict";
import FailComponent from "./failComponent";

function Container(props) {
    const { visible, disabled, collapsible, width, height, childNodes, label } = props.objProps;
    const id = props.uuid;
    const hookset = React.useRef(null);
    const [active, setActive] = React.useState<Boolean>(false);
    //attach hooks to html
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, func]) => {
                switch (key) {
                    case "clickIn": hookset.current.addEventListener("click", (e) => {
                        e.preventDefault();
                        const bcr = hookset.current!.getBoundingClientRect();
                        const x = e.pageX - bcr.right;
                        const y = e.pageY - bcr.top;
                        return (func as Function)({
                            x,
                            y,
                            visible: active,
                            value: [x, y]
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
                            visible: active,
                            value: [x, y]
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
                            visible: active,
                            value: [x, y]
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
                            visible: active,
                            value: [x, y]
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
                            visible: active,
                            value: [x, y]
                        })
                    }); break;
                    case "load": (func as Function)({}); break;
                    case "keyPressed": hookset.current.addEventListener("keypress", (e) => {
                        e.preventDefault();
                        return (func as Function)({
                            visible: active,
                            value: e.keyCode,
                            shift: e.shiftKey
                        })
                    }); break;
                    case "scroll": hookset.current.addEventListener("wheel", (e) => {
                        e.preventDefault();
                        const x = e.deltaX;
                        const y = e.deltaY;
                        return (func as Function)({
                            x,
                            y,
                            visible: active,
                            value: [x, y]
                        })
                    }); break;
                    default:
                        toast("invalid event type");
                }
            })
        }
    }, []);

    return (
        <fieldset id={id} ref={hookset} disabled={disabled} style={{ overflow: "scroll", visibility: helpers.toggleVis(visible), width, height: (active) ? height : "0em" }}>
            <legend>{collapsible && <h5 style={{ display: "inline" }} onClick={() => setActive(!active)}>{active ? "⯆" : "⯈"}</h5>}{label}</legend>
            {active && childNodes && childNodes !== [] && childNodes.map((item, i) => (
                <React.Fragment key={id + i}>
                    {React.createElement(compDict[item.id] || FailComponent,
                        { key: id + item.id + i, uuid: item.uuid, objProps: item.defaults, objHooks: item.hooks, validate: item.validate })}
                    <br />
                </React.Fragment>
            ))}
        </fieldset>
    );
}

export default Container;
