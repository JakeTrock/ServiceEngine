import React from "react";
import { toast } from "react-toastify";
import helpers from "../../../../data/helpers";
import { compDict } from "../compDict";
import FailComponent from "./failComponent";

function KvpBuilder(props) {
    const { visible, size, width, value, childNodesCurrent, childNodesPossible, disabled } = props.objProps;
    const {
        maxListLength,
        minListLength,
        keyWhitelist,
        allowExtendedChoice
    } = props.validate || {};
    const id = props.uuid;

    const [allComps, setAllComps] = React.useState<string[]>(childNodesCurrent || []);
    const [allVals, setAllVals] = React.useState<{ [key: string]: string | number | boolean | object }>(value || {});
    const [selectableNodes, setSelectableNodes] = React.useState<string[]>(Object.getOwnPropertyNames(childNodesPossible));
    const hookset = React.useRef(null);
    const keybox = React.useRef(null);
    const valbox = React.useRef(null);

    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && Object.getOwnPropertyNames(ohooks).includes("change")) {
            return (ohooks["change"] as Function)({
                comps: allComps,
                value: allVals
            })
        }
    }, [allComps, allVals, props.objHooks]);


    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //typical hook attachment loop
            Object.entries(ohooks).forEach(([key, func]) => {
                switch (key) {
                    case "clickIn": hookset.current.addEventListener("click", (e) => {
                        e.preventDefault();
                        return (func as Function)({
                            value: allVals
                        })
                    }); break;
                    case "doubleClickIn": hookset.current.addEventListener("dblclick", (e) => {
                        e.preventDefault();
                        return (func as Function)({
                            value: allVals
                        })
                    }); break;
                    case "clickOut": hookset.current.addEventListener("blur", (e) => {
                        e.preventDefault();
                        return (func as Function)({
                            value: allVals
                        })
                    }); break;
                    case "mouseIn": hookset.current.addEventListener("mouseover", (e) => {
                        e.preventDefault();
                        return (func as Function)({
                            value: allVals
                        })
                    }); break;
                    case "mouseOut": hookset.current.addEventListener("mouseout", (e) => {
                        e.preventDefault();
                        return (func as Function)({
                            value: allVals
                        })
                    }); break;
                    case "load": (func as Function)({
                        comps: allComps,
                        value: allVals
                    }); break;
                    case "keyPressed": hookset.current.addEventListener("click", (e) => {
                        e.preventDefault();
                        return (func as Function)({
                            key: e.keyCode,
                            shift: e.shiftKey,
                            value: allVals
                        })
                    }); break;
                    case "scroll": hookset.current.addEventListener("wheel", (e) => {
                        e.preventDefault();
                        const x = e.deltaX;
                        const y = e.deltaY;
                        return (func as Function)({
                            x,
                            y,
                            value: allVals
                        })
                    }); break;
                    default:
                        toast("invalid event type");
                }
            })
        }
    }, [allComps, allVals, maxListLength, minListLength, props.objHooks]);

    const addercond = () => {
        const mll = !maxListLength || Object.getOwnPropertyNames(allVals).length < maxListLength;
        const dupe = !keyWhitelist || (keyWhitelist && allowExtendedChoice) ||
            (keyWhitelist && !allowExtendedChoice && Object.getOwnPropertyNames(allVals).length < Object.getOwnPropertyNames(keyWhitelist).length);
        return mll && dupe;
    }

    const kvpAdd = () => {
        if (keybox.current != null && valbox.current != null) {
            const keyVal = keybox.current.value;
            const newVal = valbox.current.value;
            if (keyVal !== "" && newVal !== "") {
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
                            let nav = JSON.parse(JSON.stringify(av));//insert new default value into list
                            if (childNodesPossible[newVal].defaults)
                                nav[keyVal] = childNodesPossible[newVal].defaults.value;
                            else nav[keyVal] = undefined;
                            return nav;
                        });
                        setAllComps([...allComps, newVal])
                        setSelectableNodes(Object.getOwnPropertyNames(childNodesPossible));
                        keybox.current.value = "";
                    }
                }
            }
        }
    };

    const optlist = (() => {
        const allvals = Object.getOwnPropertyNames(allVals);
        if (keyWhitelist) {
            const allkeys = Object.getOwnPropertyNames(keyWhitelist);
            return allkeys.filter(n => allvals.indexOf(n) < 0);
        } else return allvals;
    })().map((lbl, i) => (
        <option key={i} value={lbl}>{lbl}</option>
    ));


    const minusButton = (i) => (<button className="smbutton" type="button" onClick={() => {
        if (minListLength && Object.getOwnPropertyNames(allVals).length - 1 < minListLength) {
            return toast(`This list should be between ${minListLength} and ${maxListLength} in length`)
        } else {
            setAllVals((av) => {
                const vals = JSON.parse(JSON.stringify(av));
                const pnames = Object.getOwnPropertyNames(vals);
                delete vals[pnames[i]];
                return vals;
            })
            setAllComps((ac)=>{
                const comps = [...ac]
                comps.splice(i, 1);
                return comps;
            })
        }
    }}>-</button>);
    return (
        <>
            <fieldset id={id} ref={hookset} disabled={disabled}>
                <div style={{ backgroundColor: "white", border: "1px solid black", overflow: "scroll", width, visibility: helpers.toggleVis(visible), fontSize: size || "1em" }}>
                    {allComps.map((item, i) => childNodesPossible[item] && (
                        <React.Fragment key={id + i + childNodesPossible[item].id}>
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
                                React.createElement(compDict[childNodesPossible[item].id] || FailComponent,
                                    {
                                        key: id + i + childNodesPossible[item].uuid, uuid: childNodesPossible[item].uuid, objProps: childNodesPossible[item].defaults, objHooks: {
                                            ...childNodesPossible[item].hooks, "change": (e) =>
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
                                        }, validate: childNodesPossible[item].validate
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
                        <button className="smbutton" type="button" onClick={() => kvpAdd()}>+</button>
                    </div>)}
                </div>
            </fieldset>
        </>
    );
}

export default KvpBuilder;
