import React from "react";
import { toast } from "react-toastify";
import helpers from "../../data/helpers";

function UploadButtonBlock(props) {//TODO:make this a drag and drop
    const { visible, disabled, size, required, multiple } = props.objProps;
    const formats = props.validate?.formats;
    const maxSize = props.validate?.maxSize || 4294967296;
    const hookset = React.useRef(null);

    const validateFiles = (e) => {
        const files = [...e.target.files];
        if (!!files.find((f: File) => f.size > (maxSize))) {//hardcode in the filesize limit for wasm
            hookset.current.value = "";
            toast.error("File is too big!");
        } else if (formats && (files && files.length > 0 && files.find((f: File) => formats.indexOf(f.type) < 0))) {
            hookset.current.value = "";
            toast(`This filechooser only accepts ${formats.join(",")}`)
        }
    }

    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, func]) => {

                switch (key) {
                    case "change":
                        hookset.current.addEventListener("change", () => (func as Function)({ value: [...hookset.current!.files] }))
                        break;
                    case "clickIn":
                        hookset.current.addEventListener("click", () => (func as Function)({ value: [...hookset.current!.files] }))
                        break; 
                    case "doubleClickIn":
                        hookset.current.addEventListener("dblclick", () => (func as Function)({ value: [...hookset.current!.files] }))
                        break;
                    case "mouseIn":
                        hookset.current.addEventListener("mouseover", () => (func as Function)({ value: [...hookset.current!.files] }))
                        break;
                    case "mouseOut":
                        hookset.current.addEventListener("mouseout", () => (func as Function)({ value: [...hookset.current!.files] }))
                        break;
                    case "load":
                        (func as Function)({ value: [...hookset.current!.files] });
                        break;
                    default:
                        toast("invalid event type");
                }
            });
        }
    }, []);
    const id = props.uuid;

    return (
        <input type="file" onChange={validateFiles} id={id} ref={hookset} disabled={disabled} multiple={multiple} accept={formats && formats.join(", ")} required={required} style={{ visibility: helpers.toggleVis(visible), fontSize: size || "1em" }} />
    );
}

export default UploadButtonBlock;