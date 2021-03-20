import React from "react";
import { Holder, InputNorm } from "../../../data/styles";
import "../../../data/styles_custom/switch.css";

function FlexList(props) {
    return (
        <Holder>
            <InputNorm onChange={(e) => {
                props.component.params = [e.target.value];
                props.callback(props.component);
            }} placeholder="name here" />
        </Holder>
    );
}
export default FlexList;
