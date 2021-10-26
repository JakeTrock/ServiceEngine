import React from "react";
import { toast } from "react-toastify";

function UploadButtonBlock(props) {
    const { visible, disabled, size, required, multiple } = props.objProps;
    const { formats, maxSize } = props.validate;
    const hookset = React.useRef(null);
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, value]) => {
                hookset.current.addEventListener(key, (e) => {
                    const files = [...e.target.files];
                    const sizeViolation = !!files.find((f: File) => f.size > (maxSize || 4294967296));
                    const typeViolation = (formats && files && files.length > 0) ? !!files.find((f: File) => formats.indexOf(f.type) < 0) : false;
                    if (sizeViolation) {//hardcode in the filesize limit for wasm
                        hookset.current.value = "";
                        toast.error("File is too big!");
                    } else if (typeViolation) {
                        hookset.current.value = "";
                        toast(`This filechooser only accepts ${formats.join(",")}`)
                    } else return (value as Function)({ files });
                });
            });
        }
    }, []);
    const id = props.uuid;
    const vis = (visible) ? "visible" : "hidden";
    return (
        <input type="file" id={id} ref={hookset} disabled={disabled} multiple={multiple} required={required} style={{ visibility: vis, fontSize: size }} />
    );
}

export default UploadButtonBlock;
