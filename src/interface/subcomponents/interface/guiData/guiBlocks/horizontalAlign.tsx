import React from "react";
import { compDict } from "../compDict";
import FailComponent from "./failComponent";

function HorizontalAlign(props) {
    const { visible, width, height, childNodes } = props.objProps;
    const id = props.uuid;
    const vis = (visible === false) ? "hidden" : "visible";
    const hookset = React.useRef(null);
    //attach hooks to html
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, value]) => {
                hookset.current.addEventListener(key, () => (value as Function)());
            })
        }
    }, []);

    return (
        <div key={props.key} id={id} ref={hookset} style={{ display: "flex", overflowX: "scroll", visibility: vis, width, height }}>
            {childNodes && childNodes !== [] && childNodes.map((nodes, i) => (
                <div style={{ overflowY: "scroll" }}>
                    {nodes.map((item, i) => (
                        <React.Fragment key={i}>
                            {
                                React.createElement(compDict[item.id] || FailComponent,
                                    { key: i, uuid: item.uuid, objProps: item.defaults, objHooks: item.hooks, validate: item.validate })
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
