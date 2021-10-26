import React from "react";

function OneChoice(props) {
    const { visible, size, disabled, labels, required } = props.objProps;
    const hookset = React.useRef(null);
    //attach hooks to html
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, value]) => {
                hookset.current.addEventListener(key, e => (value as Function)({ value: e.target.value }));
            })
        }
    }, []);
    const id = props.uuid;
    const vis = (visible) ? "visible" : "hidden";
    const labelsArray: string[] = labels !== undefined ? labels : [];
    return (
        <select id={id} required={required} ref={hookset} disabled={disabled} style={{ visibility: vis, fontSize: size }}>
            {labelsArray.map((lbl, i) => (
                <option key={i} value={lbl}>{lbl}</option>
            ))}
        </select>
    );
}

export default OneChoice;