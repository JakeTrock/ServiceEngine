import React from "react";

function CanvasFrame(props) {//TODO: important find a way to pass in frame stream from wasm
    const { visible, width, height } = props.objProps;
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
        <canvas id={id} ref={hookset} style={{ visibility: vis, width, height, backgroundColor: "white" }} />
    );
}

export default CanvasFrame;
