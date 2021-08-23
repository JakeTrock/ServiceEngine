import React from "react";

function TextBox(props) {
    const { visible, disabled, size, value, multirow } = props.objProps;
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
        <>
            {multirow ?
                <textarea id={id} disabled={disabled} ref={hookset} style={{ visibility: vis, fontSize: size }} defaultValue={value} /> :
                <input type="text" id={id} disabled={disabled} ref={hookset} style={{ visibility: vis, fontSize: size }} defaultValue={value} />}
        </>
    );
}

export default TextBox;
