import React from "react";
import { toast } from "react-toastify";
import helpers from "../../data/helpers";
import { compDict } from "../compDict";
import FailComponent from "./failComponent";

function HorizontalAlign(props) {
    const { visible, width, height, childNodes } = props.objProps;
    const id = props.uuid;
    
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
                        const bcr = hookset.current!.getBoundingClientRect();
                        const x = e.pageX - bcr.right;
                        const y = e.pageY - bcr.top;
                        return (func as Function)({
                            x,
                            y,
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
                            value: [x, y]
                        })
                    }); break;
                    case "load": (func as Function)({}); break;
                    case "keyPressed": hookset.current.addEventListener("click", (e) => {
                        e.preventDefault();                       
                        return (func as Function)({
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
        <div id={id} ref={hookset} style={{ display: "flex", overflowX: "scroll", visibility: helpers.toggleVis(visible), width, height }}>
            {childNodes && childNodes !== [] && childNodes.map((nodes, i) => (
                <div key={id + i} style={{ overflowY: "scroll" }}>
                    {nodes.map((item, j) => (
                        <React.Fragment key={id + i + " " + j}>
                            {
                                React.createElement(compDict[item.id] || FailComponent,
                                    { key: id + i + item.id + j, uuid: item.uuid, objProps: item.defaults, objHooks: item.hooks, validate: item.validate })
                            }
                            < br />
                        </React.Fragment>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default HorizontalAlign;
