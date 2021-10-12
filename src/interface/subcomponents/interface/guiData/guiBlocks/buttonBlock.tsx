import React from "react";

//a HTML button
function ButtonBlock(props) {
    const { visible, disabled, size, label } = props.objProps;
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
    const vis = (visible) ? "visible" : "hidden";
    return (
        <button id={id} ref={hookset} disabled={disabled} style={{ visibility: vis, fontSize: size }}>{label}</button>
    );
}

export default ButtonBlock;
