import * as React from "react";
import { Holder } from "../../data/styles";

// markup
const Collapsible = (props) => {
    const [active, setActive] = React.useState<Boolean>(false);

    return (
        <Holder>
            <h5 onClick={() => setActive(!active)}>{active ? "⯈" : "⯆"}</h5>
            {active && props.children}
        </Holder>
    );
};

export default Collapsible;
