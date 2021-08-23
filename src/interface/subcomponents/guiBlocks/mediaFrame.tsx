import React from "react";

function MediaFrame(props) {//TODO: important find a way to pass in aud/vid stream from wasm
    const { visible, hasVideo, hasControls, width, height } = props.objProps;
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
        (hasVideo === "true") ? <video id={id} ref={hookset} style={{ visibility: vis, width, height }} controls={hasControls} /> :
            <audio id={id} ref={hookset} style={{ visibility: vis, width, height }} controls={hasControls} />
    );
}

export default MediaFrame;