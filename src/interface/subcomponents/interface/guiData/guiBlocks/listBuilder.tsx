import React from "react";
import { toast } from "react-toastify";
import { IFaceBlock } from "../../../../data/interfaces";
import { compDict } from "../compDict";
import FailComponent from "./failComponent";

function ListBuilder(props) {
    const { visible, size, width, childNodesCurrent, childNodesPossible, disabled } = props.objProps;
    const {
        maxListLength,
        minListLength,
    } = props.validate || {};
    const id = props.uuid;
    const vis = (visible === false) ? "hidden" : "visible";
    const [allComps, setAllComps] = React.useState<IFaceBlock[]>(childNodesCurrent);
    const [allVals, setAllVals] = React.useState<(string | number | boolean | object)[]>(childNodesCurrent.map(s => s.defaults.value));
    const hookset = React.useRef(null);
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //typical hook attachment loop
            Object.entries(ohooks).forEach(([key, value]) => {
                hookset.current.addEventListener(key, (e) => {
                    const lengthViolation = ((maxListLength && allVals.length > maxListLength) ||
                        (minListLength && allVals.length < minListLength))
                    if (lengthViolation) {
                        return toast(`This list should be between ${minListLength} and ${maxListLength} in length`)
                    } else return (value as Function)({ values: allVals });
                });
            })
        }
    }, [allComps, allVals, maxListLength, minListLength, props.objHooks]);


    const adder = (<div style={{ border: "1px solid black" }}>
        <select>
            {childNodesPossible && Object.getOwnPropertyNames(childNodesPossible).map((lbl, i) => (
                <option key={i} value={lbl}>{lbl}</option>
            ))}
        </select>
        <button type="button" onClick={(e) => {
            //@ts-ignore
            const newVal = e.currentTarget.parentNode.childNodes.item(0).value;
            if (newVal !== "") {
                if (maxListLength && allVals.length + 1 > maxListLength) {
                    return toast(`This list should be between ${minListLength} and ${maxListLength} in length`)
                } else {
                    setAllVals([...allVals, childNodesPossible[newVal].defaults.value]);
                    setAllComps([...allComps, childNodesPossible[newVal]])
                    //@ts-ignore
                    e.currentTarget.parentNode.childNodes.item(0).value = "";
                }
            }
        }}>+</button>
    </div>);

    const minusButton = (i) => (<button type="button" onClick={() => {
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
                <div style={{ backgroundColor: "white", border: "1px solid black", overflow: "scroll", width, visibility: vis, fontSize: size || "1em" }}>
                    {allComps.map((item, i) => (
                        <React.Fragment key={id + i + item.id}>
                            {
                                React.createElement(compDict[item.id] || FailComponent,
                                    {
                                        key: id + i + item.uuid, uuid: item.uuid, objProps: item.defaults, objHooks: {
                                            ...item.hooks, "change": (e) =>
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
                                        }, validate: item.validate
                                    })
                            }

                            {(maxListLength && minListLength) ? maxListLength !== minListLength && minusButton(i) : minusButton(i)}
                        </React.Fragment>
                    ))}
                    {maxListLength ? (allVals.length < maxListLength) && adder : adder}
                </div>
            </fieldset>
        </>
    );
}

export default ListBuilder;
