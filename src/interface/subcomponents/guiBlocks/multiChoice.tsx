import React from "react";

function MultiChoice(props) {
    const { visible, size, label, disabled, labels, checked } = props.objProps;
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
    const checkedArray: string[] = checked !== undefined ? checked.split(",") : [];
    const labelsArray: string[] = labels !== undefined ? labels.split(",") : [];

    return (
        <fieldset id={id} ref={hookset}>
            <legend>{label}</legend>
            {labelsArray.length !== checkedArray.length ?
                <h1>labels/checked should be the same length</h1> :
                labelsArray.map((lbl, i) => (
                    <React.Fragment key={i}>
                        <input type="checkbox" disabled={disabled} checked={checkedArray[i] === "true"} style={{ visibility: vis, fontSize: size }} />
                        <label>{lbl}</label><br />
                    </React.Fragment>
                ))
            }
        </fieldset>
    );
}

export default MultiChoice;