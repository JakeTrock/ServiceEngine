import React from "react";
import { compDict } from "../compDict";
import FailComponent from "./failComponent";
import helpers from "../../../../data/helpers";
import { toast } from "react-toastify";

function TabbedView(props) {
    const { visible, labels, width, height, childNodes } = props.objProps;
    const id = props.uuid;
    const [activeTab, setActiveTab] = React.useState<string>(labels[0]);
    const hookset = React.useRef(null);

    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && Object.getOwnPropertyNames(ohooks).includes("change")) {
            return (ohooks["change"] as Function)({
                value: activeTab,
            })
        }
    }, [activeTab, props.objHooks]);

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
                        const bcr = hookset.current!.getBoundingClientRect();
                        const x = e.pageX - bcr.right;
                        const y = e.pageY - bcr.top;
                        return (func as Function)({
                            x,
                            y,
                            value: activeTab,
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
                            value: activeTab,
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
                            value: activeTab,
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
                            value: activeTab,
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
                            value: activeTab,
                        })
                    }); break;
                    case "load": (func as Function)({}); break;
                    case "keyPressed": hookset.current.addEventListener("click", (e) => {
                        e.preventDefault();                      
                        return (func as Function)({
                            key: e.keyCode,
                            shift: e.shiftKey,
                            value: activeTab,
                        })
                    }); break;
                    case "scroll": hookset.current.addEventListener("wheel", (e) => {
                        e.preventDefault();
                        const x = e.deltaX;
                        const y = e.deltaY;
                        return (func as Function)({
                            x,
                            y,
                            value: activeTab,
                        })
                    }); break;
                    default:
                        toast("invalid event type");
                }
            })
        }
    }, []);

    return (
        <div className="tabs">
            <ol className="list-reset flex border-b">
                {labels.map((lbl) => <li
                    className={activeTab === lbl ? 'bg-white inline-block border-b-2 py-2 px-4 hover:text-blue-darker font-semibold hover:text-purple-500 focus:outline-none' : 'bg-white inline-block rounded-t py-2 px-4 hover:text-purple-500 focus:outline-none'}
                    onClick={() => setActiveTab(lbl)}
                    key={id + lbl}
                >
                    {lbl}
                </li>)}
            </ol>


            <div id={id} ref={hookset} style={{ display: "flex", overflow: "scroll", visibility: helpers.toggleVis(visible), width, height }}>
                {childNodes && childNodes !== [] && childNodes.map((node, i) => labels.indexOf(activeTab) == i && (
                    <React.Fragment key={id + i}>
                        {node.map((el, j) => (React.createElement(compDict[el.id] || FailComponent,
                            { key: id + (i + el.id + j), uuid: el.uuid, objProps: el.defaults, objHooks: el.hooks, validate: el.validate }))
                        )}
                        < br />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default TabbedView;