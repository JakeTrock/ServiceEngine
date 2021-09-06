import React from "react";
import { toast } from "react-toastify";

function UploadButtonBlock(props) {
    const { visible, disabled, size } = props.objProps;
    const hookset = React.useRef(null);
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            Object.entries(ohooks).forEach(([key, value]) => {
                hookset.current.addEventListener(key, value);
            })
        }
    }, []);
    hookset.current.onchange = function () {//hardcode in the filesize limit for wasm
        if (this.files[0].size > 4294967296) {
            toast("File is too big!");
            this.value = "";
        };
    };

    const id = props.uuid;
    const vis = (visible) ? "visible" : "hidden";
    return (
        <input type="file" id={id} ref={hookset} disabled={disabled} style={{ visibility: vis, fontSize: size }} />
    );
}

export default UploadButtonBlock;
