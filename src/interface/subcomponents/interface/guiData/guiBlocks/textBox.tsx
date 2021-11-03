import React from "react";
import { toast } from "react-toastify";

function TextBox(props) {
    const { visible, disabled, size, value, multirow, required } = props.objProps;
    const {
        maxChars,
        minChars,
        useBlacklist,
        useWhitelist,
        wordList,
        validateRegex,
        validateMessage
    } = props.validate || {};
    const hookset = React.useRef(null);
    //attach hooks to html
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, value]) => {
                hookset.current.addEventListener(key, (e) => {
                    const val = e.target.value;
                    if (maxChars && minChars && minChars > maxChars) return toast("invalid max/min values");
                    const badlen = (maxChars && val.length > maxChars) || (minChars && val.length < minChars);
                    const wlistViolation = wordList && (useBlacklist ?
                        wordList.find(w => val.indexOf(w) > -1) :
                        (useWhitelist ? wordList.find(w => val.indexOf(w) < 0) : true));
                    const regexViolation = validateRegex && validateMessage && val.match(validateRegex);

                    if (badlen) {
                        hookset.current.value = hookset.current.value.substring(0, maxChars - 1 + (minChars || 0));
                        toast(`The length of this textbox is limited to between ${minChars || 0} and ${maxChars} characters`)
                    } else if (regexViolation) {
                        hookset.current.value = "";
                        toast(validateMessage);
                    } else if (wlistViolation) {
                        hookset.current.value = "";
                        toast('Please do not type words that are restricted')
                    } else return (value as Function)({ value: val });
                });
            })
        }
    }, []);
    const id = props.uuid;
    const vis = (visible === false) ? "hidden" : "visible";
    return (
        <>
            {multirow || false ?
                <textarea id={id} disabled={disabled} required={required} ref={hookset} style={{ visibility: vis, fontSize: size || "1em" }} defaultValue={value} /> :
                <input type="text" id={id} disabled={disabled} required={required} ref={hookset} style={{ visibility: vis, fontSize: size || "1em" }} defaultValue={value} />}
        </>
    );
}

export default TextBox;