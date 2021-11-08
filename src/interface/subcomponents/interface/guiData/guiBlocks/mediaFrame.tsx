import React from "react";

function MediaFrame(props) {
    const { visible, hasVideo, hasControls, width, height } = props.objProps;
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
    const vis = () => (visible === false) ? "hidden" : "visible";
    return (
        (hasVideo === "true") ? <video id={id} ref={hookset} style={{ visibility: vis(), width, height }} controls={hasControls} /> :
            <audio id={id} ref={hookset} style={{ visibility: vis(), width, height }} controls={hasControls} />
    );
}

export default MediaFrame;
