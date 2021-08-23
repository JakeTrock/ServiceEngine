import React from "react";

function TextBlock(props) {
    const { visible, size, label } = props.objProps;
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
        <p id={id} ref={hookset} style={{ visibility: vis, fontSize: size }}>{label}</p>
    );
}

export default TextBlock;
