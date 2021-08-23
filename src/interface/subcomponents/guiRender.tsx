import React from "react";
import { IFaceBlock } from "../data/interfaces";
import compDict from "../data/compDict";

function GuiRender(props) {

    const mkevt = (evtName: string) => {
        const evv = evtName.valueOf();
        const evfunction = (e) => props.controllerFunctions(evv, e);
        return evfunction;
    };

    const processHooks = () => {
        return props.schema.map(prp => {
            if (prp.hooks && prp.hooks !== {}) {
                Object.entries(prp.hooks).forEach(([key, value]) => {
                    if (typeof value === "string") {
                        prp.hooks[key] = mkevt(value)
                    }
                })
            }
            return prp;
        });
    }

    const scheme: IFaceBlock[] = processHooks();

    return (
        <form>
            {scheme.map((item, i) => (
                <>
                    {React.createElement(compDict[item.id], { key: i, uuid: item.uuid, objProps: item.defaults, objHooks: item.hooks })}
                    <br />
                </>
            ))}
        </form>
    );
}

export default GuiRender;