import React, { useState } from "react";
import { FormButton, Holder, InputNorm } from "../../../data/styles";
import "../../../data/styles_custom/switch.css";

function FlexList(props) {
    const [comps, setComps] = useState(props.component.params);
    return (
        <Holder>
            <Holder>
                {comps.map((result, index) => {
                    return (
                        <Holder key={index}>
                            <InputNorm onChange={(e) => {
                                comps[index] = e.target.value;
                                setComps(comps);
                                const tmp = props.component;
                                tmp.params = comps;
                                props.callback(tmp);
                            }} placeholder="new list item" value={result} />
                        </Holder>
                    );
                })}
                <FormButton onClick={() => setComps(comps.push(""))}>+</FormButton>
            </Holder>
        </Holder>
    );
}
export default FlexList;
