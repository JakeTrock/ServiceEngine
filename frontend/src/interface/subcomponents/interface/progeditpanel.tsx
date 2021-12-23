import React from "react";
import { IFaceBlock } from "../../data/interfaces";
import { compDict, compDefaults } from "../../guiData/compDict";
import { v4 as uuidv4 } from 'uuid';
import '../../data/ctxmenu.css';
import { toast } from "react-toastify";
import KvpBuilder from "../../guiData/guiBlocks/kvpBuilder";

const findEvts = (blks) => {

    let allHookAps = [];

    const hksOfBlock = (blk, legacies = "") => {
        if (blk.childNodesPossible) {
            Object.getOwnPropertyNames(blk.childNodesPossible).forEach(name => {
                hksOfBlock(legacies + "," + blk.childNodesPossible[name].uuid, blk.childNodesPossible[name]);
            });
        }
        allHookAps.push(legacies + "," + blk.childNodesPossible.uuid);//TODO:enforce uuid!!! create a seperate type!!!
    }

    return allHookAps;
}

function ProgEditPanel(props) {
    //TODO: this may not work properly/lack featurez
    return (
        <>
            {"const init=(imports)=>{"}
            {props.imports.map((name: string) => `const ${name} = imports.libraries.${name};\n`)}
            <textarea onChange={e => props.varSet(e.target.value)} style={{ height: "100%" }}>
                {props.initVars}
            </textarea>
            {"return {"}
            {findEvts(props.blocks).map((name: string, i) => {
                <>
                    {`${name}: (event, formAccess, additional, notify) => {`}
                    <textarea onChange={e => props.scriptSet(scripts => scripts.map((s, v) => {
                        if (v === i) {
                            return e.target.value;
                        } else {
                            return s;
                        }
                    }))} style={{ height: "100%" }}>
                        {props.initScripts[i]}
                    </textarea>
                    {`},\n`}
                </>
            })}
            {`}};(()=>{window.glue=init;})();`}
        </>
    );
}

export default ProgEditPanel;