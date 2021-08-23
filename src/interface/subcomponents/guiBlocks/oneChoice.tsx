import React from "react";

function OneChoice(props) {
    const { visible, size, disabled, labels } = props.objProps;
    const hookset = React.useRef(null);
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            Object.entries(ohooks).forEach(([key, value]) => {
                hookset.current.addEventListener(key, value);
            })
        }
    }, []);
    const id = props.uuid;
    const vis = (visible) ? "visible" : "hidden";
    const labelsArray: string[] = labels !== undefined ? labels.split(",") : [];
    return (
        <select id={id} ref={hookset} disabled={disabled} style={{ visibility: vis, fontSize: size }}>
            {labelsArray.map((lbl, i) => (
                <option key={i} value={lbl}>{lbl}</option>
            ))}
        </select>
    );
}

export default OneChoice;