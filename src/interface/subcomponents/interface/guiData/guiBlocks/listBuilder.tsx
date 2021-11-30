import React from "react";
import { toast } from "react-toastify";
import helpers from "../../../../data/helpers";
import { compDict } from "../compDict";
import FailComponent from "./failComponent";

function ListBuilder(props) {
    const { visible, size, width, value, childNodesCurrent, childNodesPossible, disabled } = props.objProps;
    const {
        maxListLength,
        minListLength,
    } = props.validate || {};
    const id = props.uuid;

    const [allComps, setAllComps] = React.useState<string[]>(childNodesCurrent);
    const [allVals, setAllVals] = React.useState<(string | number | boolean | object)[]>(value);
    const hookset = React.useRef(null);

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
                    case "change": break;
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


    const adder = (<div style={{ border: "1px solid black" }}>
        {childNodesPossible && childNodesPossible.length > 1 ?
            <>
                <select>
                    {Object.getOwnPropertyNames(childNodesPossible).map((lbl, i) => (
                        <option key={i} value={lbl}>{lbl}</option>
                    ))}
                </select>
                <button className="smbutton" type="button" onClick={(e) => {
                    //@ts-ignore
                    const newVal = e.currentTarget.parentNode.childNodes.item(0).value;
                    if (newVal !== "") {
                        if (maxListLength && allVals.length + 1 > maxListLength) {
                            return toast(`This list should be between ${minListLength} and ${maxListLength} in length`)
                        } else {
                            setAllVals([...allVals, childNodesPossible[newVal].defaults.value]);
                            setAllComps([...allComps, newVal]);
                            //@ts-ignore
                            // e.currentTarget.parentNode.childNodes.item(0).value = "";
                        }
                    }
                }}>+</button>
            </> : <button className="smbutton" type="button" style={{ width: "90%" }} onClick={(e) => {
                //@ts-ignore
                const newVal = Object.getOwnPropertyNames(childNodesPossible)[0];
                if (newVal !== "") {
                    if (maxListLength && allVals.length + 1 > maxListLength) {
                        return toast(`This list should be between ${minListLength} and ${maxListLength} in length`)
                    } else {
                        setAllVals([...allVals, childNodesPossible[newVal].defaults.value]);
                        setAllComps([...allComps, newVal]);
                        //@ts-ignore
                        // e.currentTarget.parentNode.childNodes.item(0).value = "";
                    }
                }
            }}>+</button>}
    </div >);

    const minusButton = (i) => (<button className="smbutton" type="button" onClick={() => {
        if (minListLength && allVals.length - 1 < minListLength) {
            return toast(`This list should be between ${minListLength} and ${maxListLength} in length`)
        } else {
            setAllVals(allVals.slice(0, i).concat(allVals.slice(i + 1, allVals.length)))
            setAllComps(JSON.parse(JSON.stringify(allComps.slice(0, i).concat(allComps.slice(i + 1, allComps.length)))))
        }
    }}>-</button>);

    return (
        <>
            <fieldset id={id} ref={hookset} disabled={disabled}>
                <div style={{ backgroundColor: "white", border: "1px solid black", overflow: "scroll", width, visibility: helpers.toggleVis(visible), fontSize: size || "1em" }}>
                    {allComps.map((item, i) => (
                        <React.Fragment key={id + i + childNodesPossible[item].id}>
                            {
                                React.createElement(compDict[childNodesPossible[item].id] || FailComponent,
                                    {
                                        key: id + i + childNodesPossible[item].uuid, uuid: childNodesPossible[item].uuid, objProps: (() => {
                                            //make value the one from values instead
                                            let tmp = JSON.parse(JSON.stringify(childNodesPossible[item].defaults));
                                            if (tmp.hasOwnProperty("value") && i < value.length - 1)
                                                tmp["value"] = value[i];
                                            return tmp;
                                        })(), objHooks: {
                                            ...childNodesPossible[item].hooks, "change": (e) =>
                                                setAllVals(vals => {
                                                    const list = vals.map((item, j) => {
                                                        if (j === i) {
                                                            return e.value;
                                                        } else {
                                                            return item;
                                                        }
                                                    });
                                                    return list
                                                })
                                        }, validate: childNodesPossible[item].validate
                                    })
                            }

                            {(maxListLength && minListLength) ? maxListLength !== minListLength && minusButton(i) : minusButton(i)}
                            <br />
                        </React.Fragment>
                    ))}
                    {maxListLength ? (allVals.length < maxListLength) && adder : adder}
                </div>
            </fieldset>
        </>
    );
}

export default ListBuilder;
