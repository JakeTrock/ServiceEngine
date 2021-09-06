import React from "react";

function ButtonBlock(props) {
    const { visible, disabled, size, label } = props.objProps;
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
    return (
        <button id={id} ref={hookset} disabled={disabled} style={{ visibility: vis, fontSize: size }}>{label}</button>
    );
}

export default ButtonBlock;