import React from "react";
import { toast } from "react-toastify";

function UploadButtonBlock(props) {
    const { visible, disabled, size, required, multiple } = props.objProps;
    const hookset = React.useRef(null);
    React.useEffect(() => {
        const ohooks = props.objHooks;
        hookset.current.onchange = function () {//hardcode in the filesize limit for wasm
            if (this.files[0].size > 4294967296) {
                toast.error("File is too big!");
                this.value = "";
            };
        };
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
        <input type="file" id={id} ref={hookset} disabled={disabled} multiple={multiple} required={required} style={{ visibility: vis, fontSize: size }} />
    );
}

export default UploadButtonBlock;
