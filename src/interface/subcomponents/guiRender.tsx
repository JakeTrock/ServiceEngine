import React from "react";
import { IFaceBlock } from "../data/interfaces";
import compDict from "../data/compDict";

const processHooks = (schema, makeEvent) => {
    return schema.map(prp => {
        if (prp.hooks && prp.hooks !== {}) {
            Object.getOwnPropertyNames(prp.hooks).forEach((key) => {
                if (prp.hooks[key].name&&prp.hooks[key].name!=="evfunction") {
                    prp.hooks[key] = makeEvent(prp.hooks[key]);
                }
            })
        }
        return prp;
    });
}

function GuiRender(props) {
    const mkevt = (evv) => {
        const evfunction = (e) => props.controllerFunctions(evv.name, e, evv.additional || {});
        return evfunction;
    };
    const initSch = props.schema;
    const [scheme, setScheme] = React.useState<IFaceBlock[] | []>(processHooks(initSch, mkevt));

    React.useEffect(() => {
        console.log("chg")
        if (!Object.is(props.schema, scheme)) {
            //this only works for one-at-a-time, but that's what we're using now
            let scompare1 = {}, scompare2 = {};
            scheme.forEach((s: IFaceBlock) => {
                if (s.uuid) {
                    scompare1[s.uuid] = s.defaults;
                }
            });
            props.schema.forEach((s: IFaceBlock) => {
                if (s.uuid) {
                    scompare2[s.uuid] = s.defaults;
                }
            });
            Object.getOwnPropertyNames(scompare2).forEach(k => {//TODO:built for one at a time
                if (!(k in scompare1)) {
                    const newItm: IFaceBlock = processHooks([props.schema.find((e: IFaceBlock) => e.uuid === k)], mkevt);
                    let ns: IFaceBlock[] = scheme;
                    ns.push(newItm);
                    setScheme(ns);
                }
            })
        }
    }
    // , [props.schema]
    )

    return (
        <div>
            {scheme.map((item, i) => (
                <>
                    {React.createElement(compDict[item.id], { key: i, uuid: item.uuid, objProps: item.defaults, objHooks: item.hooks })}
                    <br />
                </>
            ))}
        </div>
    );
}

export default GuiRender;