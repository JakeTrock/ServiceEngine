import React from "react";
import { compDict } from "../compDict";
import FailComponent from "./failComponent";

function Container(props) {
    const { visible, disabled, collapsible, width, height, childNodes, label } = props.objProps;
    const id = props.uuid;
    const vis = (visible === false) ? "hidden" : "visible";
    const hookset = React.useRef(null);
    const [active, setActive] = React.useState<Boolean>(false);
    //attach hooks to html
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, value]) => {
                hookset.current.addEventListener(key, (e) => (value as Function)({ visible: visible && active }));
            })
        }
    }, []);

    return (
        <fieldset id={id} ref={hookset} disabled={disabled} style={{ overflow: "scroll", visibility: vis, width, height: (active) ? height : "0em" }}>
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
