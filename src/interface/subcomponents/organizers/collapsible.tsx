import * as React from "react";

// element which can collapse its contents
const Collapsible = (props) => {
    const [active, setActive] = React.useState<Boolean>(false);

    return (
        <div>
            <h5 style={{ display: "inline" }} onClick={() => setActive(!active)}>{active ? "⯆" : "⯈"}</h5>
            {active && props.children}
        </div>
    );
};

export default Collapsible;
