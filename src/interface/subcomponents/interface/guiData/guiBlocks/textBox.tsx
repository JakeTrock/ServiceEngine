import React from "react";

function TextBox(props) {
    const { visible, disabled, size, value, multirow, required } = props.objProps;
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
        <>
            {multirow ?
                <textarea id={id} disabled={disabled} required={required} ref={hookset} style={{ visibility: vis, fontSize: size }} defaultValue={value} /> :
                <input type="text" id={id} disabled={disabled} required={required} ref={hookset} style={{ visibility: vis, fontSize: size }} defaultValue={value} />}
        </>
    );
}

export default TextBox;
