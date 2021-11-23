import React from "react";
import { toast } from "react-toastify";
import helpers from "../../../../data/helpers";

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
    const id = props.uuid;
    const hookset = React.useRef(null);

    const validateTxt = (e) => {
        const val = e.target.value;
        if (maxChars && minChars && minChars > maxChars) return toast("invalid max/min values");
        if ((maxChars && val.length > maxChars) || (minChars && val.length < minChars)) {//bad length
            hookset.current.value = hookset.current.value.substring(0, maxChars - 1 + (minChars || 0));
            toast(`The length of this textbox is limited to between ${minChars || 0} and ${maxChars} characters`)
        } else if (validateRegex && validateMessage && val.match(validateRegex)) {//regex violation
            hookset.current.value = "";
            toast(validateMessage);
        } else if (wordList && (useBlacklist ?
            wordList.find(w => val.indexOf(w) > -1) :
            (useWhitelist ? wordList.find(w => val.indexOf(w) < 0) : true))) {//wordlist violation
            hookset.current.value = "";
            toast('Please do not type words that are restricted')
        }
    };

    //attach hooks to html
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, func]) => {
                switch (key) {
                    case "change": hookset.current.addEventListener("change", () => (ohooks["change"] as Function)({
                        value: hookset.current.value,
                    })); break;
                    case "clickIn": hookset.current.addEventListener("click", (e) => {
                        e.preventDefault();
                        const bcr = hookset.current!.getBoundingClientRect();
                        const x = e.pageX - bcr.right;
                        const y = e.pageY - bcr.top;
                        return (func as Function)({
                            x,
                            y,
                            value: hookset.current!.value
                        })
                    }); break;
                    case "doubleClickIn": hookset.current.addEventListener("dblclick", (e) => {
                        e.preventDefault();
                        const bcr = hookset.current!.getBoundingClientRect();
                        const x = e.pageX - bcr.right;
                        const y = e.pageY - bcr.top;
                        return (func as Function)({
                            x,
                            y,
                            value: hookset.current!.value
                        })
                    }); break;
                    case "clickOut": hookset.current.addEventListener("blur", (e) => {
                        e.preventDefault();
                        const bcr = hookset.current!.getBoundingClientRect();
                        const x = e.pageX - bcr.right;
                        const y = e.pageY - bcr.top;
                        return (func as Function)({
                            x,
                            y,
                            value: hookset.current!.value
                        })
                    }); break;
                    case "mouseIn": hookset.current.addEventListener("mouseover", (e) => {
                        e.preventDefault();
                        const bcr = hookset.current!.getBoundingClientRect();
                        const x = e.pageX - bcr.right;
                        const y = e.pageY - bcr.top;
                        return (func as Function)({
                            x,
                            y,
                            value: hookset.current!.value
                        })
                    }); break;
                    case "mouseOut": hookset.current.addEventListener("mouseout", (e) => {
                        e.preventDefault();
                        const bcr = hookset.current!.getBoundingClientRect();
                        const x = e.pageX - bcr.right;
                        const y = e.pageY - bcr.top;
                        return (func as Function)({
                            x,
                            y,
                            value: hookset.current!.value
                        })
                    }); break;
                    case "load": (func as Function)({ value: hookset.current.value }); break;
                    case "keyPressed": hookset.current.addEventListener("click", (e) => {
                        e.preventDefault();
                        return (func as Function)({
                            key: e.keyCode,
                            shift: e.shiftKey,
                            value: hookset.current!.value
                        })
                    }); break;
                    case "scroll": hookset.current.addEventListener("wheel", (e) => {
                        e.preventDefault();
                        const x = e.deltaX;
                        const y = e.deltaY;
                        return (func as Function)({
                            x,
                            y,
                            value: hookset.current!.value
                        })
                    }); break;
                    default:
                        toast("invalid event type");
                }
            })
        }
    }, []);


    return (
        <>
            {multirow || false ?
                <textarea onChange={validateTxt} id={id} disabled={disabled} required={required} ref={hookset} style={{ visibility: helpers.toggleVis(visible), fontSize: size || "1em" }} defaultValue={value} /> :
                <input onChange={validateTxt} type="text" id={id} disabled={disabled} required={required} ref={hookset} style={{ visibility: helpers.toggleVis(visible), fontSize: size || "1em" }} defaultValue={value} />}
        </>
    );
}

export default TextBox;