import React from "react";
import { toast } from "react-toastify";

function UploadButtonBlock(props) {//TODO:make this a drag and drop
    const { visible, disabled, size, required, multiple } = props.objProps;
    const formats = props.validate?.formats;
    const maxSize = props.validate?.maxSize || 4294967296;
    const hookset = React.useRef(null);
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, value]) => {
                hookset.current.addEventListener(key, (e) => {
                    const files = [...e.target.files];
                    const sizeViolation = !!files.find((f: File) => f.size > (maxSize));
                    const typeViolation = formats && (files && files.length > 0 && !files.find((f: File) => formats.indexOf(f.type) < 0));
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
    const vis = () => (visible === false) ? "hidden" : "visible";
    return (
        <input type="file" id={id} ref={hookset} disabled={disabled} multiple={multiple} accept={formats && formats.join(", ")} required={required} style={{ visibility: vis(), fontSize: size||"1em" }} />
    );
}

export default UploadButtonBlock;