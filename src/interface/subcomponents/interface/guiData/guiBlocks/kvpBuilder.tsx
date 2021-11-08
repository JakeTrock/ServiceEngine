import React from "react";
import { toast } from "react-toastify";
import { IFaceBlock } from "../../../../data/interfaces";
import { compDict } from "../compDict";
import FailComponent from "./failComponent";

function KvpBuilder(props) {
    const { visible, size, width, labelsCurrent, childNodesCurrent, childNodesPossible, disabled } = props.objProps;
    const {
        maxListLength,
        minListLength,
        keyWhitelist,
        allowExtendedChoice
    } = props.validate || {};
    const id = props.uuid;
    const vis = () => (visible === false) ? "hidden" : "visible";
    const getAllKeys = () => {
        if (Array.isArray(keyWhitelist))
            return keyWhitelist
        else
            return Object.getOwnPropertyNames(keyWhitelist)
    };
    const initJSON = (() => {
        let finalJson = {};
        if (labelsCurrent.length !== childNodesCurrent.length) {
            toast("Must have same number of labels and inputs!")
            return {};
        }
        childNodesCurrent.forEach((s, i) => finalJson[labelsCurrent[i]] = s.defaults.value)
        return finalJson;
    })();
    const [allComps, setAllComps] = React.useState<IFaceBlock[]>(childNodesCurrent);
    const [allVals, setAllVals] = React.useState<{ [key: string]: string | number | boolean | object }>(initJSON);
    const [selectableNodes, setSelectableNodes] = React.useState<string[]>(Object.getOwnPropertyNames(childNodesPossible));
    const hookset = React.useRef(null);
    const keybox = React.useRef(null);
    const valbox = React.useRef(null);

    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //typical hook attachment loop
            Object.entries(ohooks).forEach(([key, value]) => {
                hookset.current.addEventListener(key, (e) => {
                    const lengthViolation = ((maxListLength && allVals.length > maxListLength) ||
                        (minListLength && allVals.length < minListLength))
                    if (lengthViolation) {
                        toast(`This list should be between ${minListLength} and ${maxListLength} in length`)
                    } else return (value as Function)({ values: allVals });
                });
            })
        }
    }, [allComps, allVals, maxListLength, minListLength, props.objHooks]);

    const addercond = () => {
        const mll = !maxListLength || Object.getOwnPropertyNames(allVals).length < maxListLength;
        const dupe = !keyWhitelist || (keyWhitelist && allowExtendedChoice) || (keyWhitelist && !allowExtendedChoice && Object.getOwnPropertyNames(allVals).length < getAllKeys().length);
        return mll && dupe;
    }

    const kvpAdd = () => {
        if (keybox.current != null && valbox.current != null) {
            const keyVal = keybox.current.value;
            const newVal = valbox.current.value;
            if (keyVal !== "" && newVal !== "") {
                console.log(keyVal, newVal)
                if (maxListLength && Object.getOwnPropertyNames(allVals).length + 1 > maxListLength) {
                    return toast(`This list should be between ${minListLength} and ${maxListLength} in length`)
                }

                else {
                    if (Object.getOwnPropertyNames(allVals).indexOf(keyVal) > -1) {
                        return toast("Cannot insert duplicate keys!");
                    } else if (!childNodesPossible.hasOwnProperty(newVal)) {
                        return toast("Please choose an accompanying pairing type!");
                    } else {
                        setAllVals(av => {
                            if (childNodesPossible[newVal].defaults) {//TODO:everything should return a value, this will eventually be depricated
                                let nav = av;//insert new default value into list
                                nav[keyVal] = childNodesPossible[newVal].defaults.value;
                                return nav;
                            }
                        });
                        setAllComps([...allComps, childNodesPossible[newVal]])
                        setSelectableNodes(Object.getOwnPropertyNames(childNodesPossible));
                        keybox.current.value = "";
                    }
                }
            }
        }
    };

    const optlist = (() => {
        const allvals = Object.getOwnPropertyNames(allVals);
        const allkeys = getAllKeys();
        return allkeys.filter(n => allvals.indexOf(n) < 0);
    })().map((lbl, i) => (
        <option key={i} value={lbl}>{lbl}</option>
    ));


    const minusButton = (i) => (<button type="button" onClick={() => {
        if (minListLength && Object.getOwnPropertyNames(allVals).length - 1 < minListLength) {
            return toast(`This list should be between ${minListLength} and ${maxListLength} in length`)
        } else {
            setAllVals((vals) => {
                const pnames = Object.getOwnPropertyNames(vals);
                delete vals[pnames[i]];
                return vals;
            })
            setAllComps(JSON.parse(JSON.stringify(allComps.slice(0, i).concat(allComps.slice(i + 1, allComps.length)))))
        }
    }}>-</button>);

    return (
        <>
            <fieldset id={id} ref={hookset} disabled={disabled}>
                <div style={{ backgroundColor: "white", border: "1px solid black", overflow: "scroll", width, visibility: vis(), fontSize: size || "1em" }}>
                    {allComps.map((item, i) => (
                        <React.Fragment key={id + i + item.id}>
                            <input type="text" defaultValue={Object.getOwnPropertyNames(allVals)[i]} onChange={(e) =>
                                setAllVals(vals => {
                                    if (keyWhitelist && keyWhitelist[e.target.value]) {
                                        toast("this value cannot be changed")
                                        return vals;
                                    }
                                    let finalJson = {};
                                    //this may seem jank but it's just incase the user allows duplicates
                                    Object.entries(vals).forEach(([key, value], j) => {
                                        if (j === i) {
                                            finalJson[e.target.value] = value;
                                        } else {
                                            finalJson[key] = value;
                                        }
                                    });
                                    return finalJson
                                })} /> :
                            {
                                React.createElement(compDict[item.id] || FailComponent,
                                    {
                                        key: id + i + item.uuid, uuid: item.uuid, objProps: item.defaults, objHooks: {
                                            ...item.hooks, "change": (e) =>
                                                setAllVals(vals => {
                                                    if (keyWhitelist && keyWhitelist[e.value] && keyWhitelist[e.value].keyRegex && !e.value.match(keyWhitelist[e.value].keyRegex)) {
                                                        toast(keyWhitelist[e.value].keyRegexMsg)
                                                        return vals;
                                                    }
                                                    const keyv = Object.getOwnPropertyNames(vals).find((x, j) => (j === i));
                                                    if (keyv) {
                                                        vals[keyv] = e.value;
                                                        return vals;
                                                    } else return vals;
                                                })
                                        }, validate: item.validate
                                    })
                            }

                            {(maxListLength && minListLength && !allowExtendedChoice) ? maxListLength !== minListLength && minusButton(i) : minusButton(i)}
                        </React.Fragment>
                    ))}

                    {addercond() && (<div style={{ border: "1px solid black" }}>
                        {!allowExtendedChoice ?
                            <select ref={keybox} onChange={() => {
                                if (keyWhitelist && keybox.current != null && keyWhitelist[keybox.current.value]?.inputMatch) {
                                    setSelectableNodes([keyWhitelist[keybox.current.value].inputMatch]);
                                } else setSelectableNodes(Object.getOwnPropertyNames(childNodesPossible));
                            }} >
                                {optlist}
                            </select> : <>
                                <input type="text" onChange={() => {
                                    if (keyWhitelist && keybox.current != null && keyWhitelist[keybox.current.value]?.inputMatch) {
                                        setSelectableNodes([keyWhitelist[keybox.current.value].inputMatch]);
                                    } else setSelectableNodes(Object.getOwnPropertyNames(childNodesPossible));
                                }} ref={keybox} placeholder="key name here" list="suggestions" />
                                <datalist id="suggestions">
                                    {optlist}
                                </datalist>
                            </>}
                        <select ref={valbox}>
                            {childNodesPossible && selectableNodes.map((lbl, i) => (
                                <option key={i} value={lbl}>{lbl}</option>
                            ))}
                        </select>
                        <button type="button" onClick={(e) => kvpAdd()}>+</button>
                    </div>)}
                </div>
            </fieldset>
        </>
    );
}

export default KvpBuilder;
