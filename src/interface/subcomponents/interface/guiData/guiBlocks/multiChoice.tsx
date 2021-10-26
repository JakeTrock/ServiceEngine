import React from "react";
import { toast } from "react-toastify";

function MultiChoice(props) {
    const { visible, size, label, disabled, labels, checked } = props.objProps;
    const { maxSelections, exclusiveChoices } = props.validate;
    const id = props.uuid;
    const vis = (visible) ? "visible" : "hidden";
    let checkedArray: boolean[] = checked !== undefined ? JSON.parse(JSON.stringify(checked)) : [];
    const labelsArray: string[] = labels !== undefined ? labels : [];
    const hookset = React.useRef(null);
    //attach hooks to html
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, value]) => {
                hookset.current.addEventListener(key, (e) => {
                    const retObject = {
                        booleans: checkedArray,
                        numSelections: checkedArray.filter(n => n === true).length,
                        asText: labelsArray.filter((l, i) => checkedArray[i])
                    }
                    const hasExclusive = (() => {
                        return exclusiveChoices.find(c => {
                            let ct = 0;
                            c.forEach(el => {
                                if (retObject.asText.indexOf(el) > -1) {
                                    ct++;
                                }
                            });
                            if (ct > 1) return true;
                            return false;
                        }) || [];
                    })();
                    if (maxSelections && retObject.numSelections > maxSelections) {
                        Array.from(hookset.current.childNodes)
                            .filter((t: any) => t.tagName === "INPUT")
                            .forEach((c: any, i) => c.checked = checked[i]);
                        checkedArray = JSON.parse(JSON.stringify(checked));
                        toast(`You can make at most ${maxSelections} selections!`)
                    } else if (hasExclusive.length > 0) {
                        console.log(hasExclusive)
                        Array.from(hookset.current.childNodes)
                            .filter((t: any) => t.tagName === "INPUT")
                            .forEach((c: any, i) => c.checked = checked[i]);
                        checkedArray = JSON.parse(JSON.stringify(checked));
                        toast(`You cannot have the following values checked together: ${hasExclusive.join(" , ")}`)
                    } else return (value as Function)(retObject);
                });
            })
        }
    }, []);

    return (
        <fieldset id={id} ref={hookset} disabled={disabled}>
            <legend>{label}</legend>
            {labelsArray.length !== checkedArray.length ?
                <h1>labels/checked should be the same length</h1> :
                labelsArray.map((lbl, i) => (
                    <React.Fragment key={i}>
                        <input type="checkbox" defaultChecked={checkedArray[i]} onClick={() => checkedArray[i] = !checkedArray[i]} style={{ visibility: vis, fontSize: size }} />
                        <label>{lbl}</label><br />
                    </React.Fragment>
                ))
            }
        </fieldset>
    );
}

export default MultiChoice;