import React from "react";

function TextBlock(props) {
    const { visible, size, label } = props.objProps;
    const hookset = React.useRef(null);
    //attach hooks to html
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, value]) => {
                hookset.current.addEventListener(key, value);
            })
        }
    }, []);
    const id = props.uuid;
    const vis = (visible === false) ? "hidden" : "visible";
    return (
        <p id={id} ref={hookset} style={{ visibility: vis, fontSize: size || "1em" }}>{label}</p>
    );
}

export default TextBlock;