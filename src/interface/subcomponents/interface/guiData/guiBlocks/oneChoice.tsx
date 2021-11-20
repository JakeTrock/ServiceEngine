import React from "react";

function OneChoice(props) {
    const { visible, size, disabled, value, labels, required } = props.objProps;
    const hookset = React.useRef(null);
    //attach hooks to html
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, value]) => {
                hookset.current.addEventListener(key, e => (value as Function)({ value: e.target.value || labels[value as number] }));
            })
        }
    }, []);
    const id = props.uuid;
    const vis = () => (visible === false) ? "hidden" : "visible";
    return (
        <select id={id} required={required} ref={hookset} disabled={disabled} defaultValue={labels[value]} style={{ visibility: vis(), fontSize: size || "1em" }}>
            {labels && labels.map((lbl, i) => (
                <option key={i} value={lbl}>{lbl}</option>
            ))}
        </select>
    );
}

export default OneChoice;
