import React from "react";
import { toast } from "react-toastify";

function ListBuilder(props) {
    const { visible, size, width, values, disabled } = props.objProps;
    const {
        useBlacklist,
        useWhitelist,
        wordList,
        minChars,
        maxChars,
        maxListLength,
        minListLength,
        validateRegex,
        validateMessage
    } = props.validate;
    const id = props.uuid;
    const vis = (visible) ? "visible" : "hidden";
    const [allVals, setAllVals] = React.useState<string[]>(values);

    const hookset = React.useRef(null);
    React.useEffect(() => {
        const ohooks = props.objHooks;
        const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(hookset.current), 'value');
        //shim for weird onchange behaviour
        Object.defineProperty(hookset.current, 'value', {
            set: function (t) {
                const event = new Event('change');
                hookset.current.dispatchEvent(event);
                return descriptor.set.apply(this, arguments);
            },
            get: function () {
                return descriptor.get.apply(this);
            }
        });
        if (ohooks && ohooks !== {}) {
            //typical hook attachment loop
            Object.entries(ohooks).forEach(([key, value]) => {
                hookset.current.addEventListener(key, (e) => {
                    const nodeVals = Array.from(e.currentTarget.childNodes[0].childNodes).filter((t: any) => t.tagName === "INPUT").map((n: any) => n.value);
                    if (maxChars && minChars && minChars > maxChars) return toast("invalid max/min values");
                    if ((!validateRegex && validateMessage) || (validateRegex && !validateMessage)) return toast("must have error message for failed regex/vice versa.");
                    const badlen = (maxChars && minChars) ?
                        nodeVals.find(v => (v.length > maxChars || v.length < minChars)) :
                        (!maxChars && !minChars) ? false :
                            (maxChars && !minChars) ?
                                nodeVals.find(v => (v.length > maxChars)) :
                                nodeVals.find(v => (v.length < minChars));

                    const wlistViolation = useBlacklist ?
                        wordList.find(w => nodeVals.find(v => v.indexOf(w) > -1)) :
                        (useWhitelist ? wordList.find(w => nodeVals.find(v => v.indexOf(w) < 0)) : true);

                    const regexViolation = nodeVals.find(w => w.match(validateRegex));

                    const lengthViolation = ((maxListLength && nodeVals.length > maxListLength) ||
                        (minListLength && nodeVals.length < minListLength))
                    if (badlen) {
                        setAllVals(values);
                        toast(`The length of these textboxes are limited to between ${minChars || 0} and ${maxChars} characters`)
                    } else if (wlistViolation) {
                        setAllVals(values);
                        toast('Please do not type words that are restricted')
                    } else if (regexViolation) {
                        setAllVals(values);
                        toast(validateMessage);
                    } else if (lengthViolation) {
                        setAllVals(values)
                        toast(`This list should be between ${minListLength} and ${maxListLength} in length`)
                    } else return (value as Function)({ values: nodeVals });
                });
            })
        }
    }, []);

    return (
        <>
            <fieldset id={id} ref={hookset} disabled={disabled}>
                <div style={{ backgroundColor: "white", border: "1px solid black", overflow: "scroll", width, visibility: vis, fontSize: size }}>
                    {allVals.map((lbl, i) => (
                        <React.Fragment key={lbl}>
                            <input type="text" defaultValue={lbl} onChange={(e) => {
                                setAllVals(allVals.map((v, j) => {
                                    if (i === j)
                                        return e.target.value;
                                    else return v;
                                }));
                            }} />
                            <button type="button" onClick={() => {
                                console.log(allVals.slice(0, i).concat(allVals.slice(i + 1, allVals.length)))
                                setAllVals(JSON.parse(JSON.stringify(allVals.slice(0, i).concat(allVals.slice(i + 1, allVals.length)))))
                            }}>-</button>
                        </React.Fragment>
                    ))}
                    <div style={{ border: "1px solid black" }}>
                        <input type="text" />
                        <button type="button" onClick={(e) => {
                            //@ts-ignore
                            const newVal = e.currentTarget.parentNode.childNodes.item(0).value;
                            if (newVal !== "") {
                                setAllVals([...allVals, newVal]);
                                //@ts-ignore
                                e.currentTarget.parentNode.childNodes.item(0).value = "";
                            }
                        }}>+</button>
                    </div>
                </div>
            </fieldset>
        </>
    );
}

export default ListBuilder;
