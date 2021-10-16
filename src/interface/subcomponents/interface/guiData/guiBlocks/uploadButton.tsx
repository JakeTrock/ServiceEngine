import React from "react";
import { toast } from "react-toastify";

function UploadButtonBlock(props) {//TODO:https://stackoverflow.com/questions/1593225/how-to-select-multiple-files-with-input-type-file
    const { visible, disabled, size, required } = props.objProps;
    const hookset = React.useRef(null);
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            const hookProps = Object.entries(ohooks);
            const chgIndex = hookProps.filter(([key, value]) => key === "change");
            if (chgIndex.length !== 0) {
                hookset.current.onchange = function (e) {//hardcode in the filesize limit for wasm
                    if (this.files[0].size > 4294967296) {
                        this.value = "";
                        return toast.error("File is too big!");
                    };
                    const fcall: any = chgIndex[0][1];
                    return fcall(e);
                };
            } else {
                hookset.current.onchange = function () {//hardcode in the filesize limit for wasm
                    if (this.files[0].size > 4294967296) {
                        toast.error("File is too big!");
                        this.value = "";
                    };
                };
            }
            hookProps.forEach(([key, value]) => {
                hookset.current.addEventListener(key, value);
            })
        } else {
            hookset.current.onchange = function () {//hardcode in the filesize limit for wasm
                if (this.files[0].size > 4294967296) {
                    toast.error("File is too big!");
                    this.value = "";
                };
            };
        }
    }, []);
    const id = props.uuid;
    const vis = (visible) ? "visible" : "hidden";
    return (
        <input type="file" id={id} ref={hookset} disabled={disabled} required={required} style={{ visibility: vis, fontSize: size }} />
    );
}

export default UploadButtonBlock;
