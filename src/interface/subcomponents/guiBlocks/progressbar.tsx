import React from "react";

function ProgressBar(props) {
    const { visible, value, max } = props.objProps;
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
        <progress id={id} ref={hookset} style={{ visibility: vis }} value={value} max={max}></progress>
    );
}

export default ProgressBar;