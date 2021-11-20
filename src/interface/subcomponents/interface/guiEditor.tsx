import React from "react";
import { v4 as uuidv4 } from 'uuid';
import { IFaceBlock } from "../../data/interfaces";
import { compDict, compDefaults } from "./guiData/compDict";
import '../../data/ctxmenu.css';
import { toast } from "react-toastify";

const categories = {
    "label": "feedback",
    "button": "input",
    "uplbutton": "input",
    "checkbox": "input",
    "textbox": "input",
    "numbox": "input",
    "datebox": "input",
    "onechoice": "input",
    "slider": "input",
    "mediabox": "feedback",
    "canvasbox": "feedback",
    "progbar": "input",
    "listbuild": "multiinput",
    "kvpbuild": "multiinput",
    "container": "holders",
    "horizontalalign": "holders",
    "tabbedview": "holders"
};

const insOptions = (() => {
    let op = {
        feedback: {},
        input: {},
        multiinput: {},
        holders: {}
    };
    compDefaults.forEach((cv) => {
        return op[categories[cv.id]][cv.id] = JSON.stringify(cv, null, 2) + ",\n"
    });
    return op;
})();

function GuiEditPanel(props) {
    const [ifOrder, setifOrder] = React.useState<IFaceBlock[]>((props.initValues && props.initValues.length > 0) ? props.initValues : []);
    const mcedit = React.useRef(null);
    const rtclick = React.useRef(null);

    const parentCallback = (e) => props.parentCallback(e);


    React.useEffect(() => {
        mcedit.current!.addEventListener("contextmenu", function (event) {
            event.preventDefault();
            rtclick.current!.style.display = "block";
            rtclick.current!.style.left = (event.pageX - 10) + "px";
            rtclick.current!.style.top = (event.pageY - 10) + "px";
        }, false);
        mcedit.current!.addEventListener("click", function (event) {
            rtclick.current!.style.display = "";
            rtclick.current!.style.left = "";
            rtclick.current!.style.top = "";
        }, false);
    }, [mcedit.current, rtclick.current]);

    const updTxt = () => {
        try {
            const inst = mcedit.current!.value.replace("\n", "");
            if (inst.match(/,(?=\s*[\)\}\]])/)) return toast("you must remove all trailing commas!");
            let ifo = JSON.parse(inst);
            ifo = ifo.filter(i => i !== undefined);//TODO:validate more
            setifOrder(ifo);
            parentCallback(ifo);
        } catch (err) {
            console.log(err)
            toast(err);
        }
    };

    const insText = (txt) => {
        if (mcedit.current!.selectionStart || mcedit.current!.selectionStart == '0') {
            var startPos = mcedit.current!.selectionStart;
            var endPos = mcedit.current!.selectionEnd;
            mcedit.current!.value = mcedit.current!.value.substring(0, startPos)
                + txt
                + mcedit.current!.value.substring(endPos, mcedit.current!.value.length);
        } else {
            mcedit.current!.value += txt;
        }
    };

    const exitclk = function (e) {
        rtclick.current!.style.display = 'none';
    }

    return (
        <div onClick={exitclk} style={{ height: "100%" }}>
            <p>hint: right click to insert templates</p><br />
            <button className="smbutton" onClick={updTxt}>save</button><br />
            <textarea defaultValue={JSON.stringify(ifOrder, null, 2) || "[\n\n]"} style={{ height: "60vh", width: "40vh", fontFamily: "tahoma" }} ref={mcedit}></textarea>
            <menu id="ctxMenu" ref={rtclick}>
                {Object.getOwnPropertyNames(insOptions).map((o, y) => (
                    <menu key={o + y} title={o}>
                        {Object.getOwnPropertyNames(insOptions[o]).map((e, i) => (
                            <menu key={o + e + i} style={{ color: "blue" }} onClick={() => insText(insOptions[o][e])} title={e}></menu>
                        ))}
                    </menu>
                ))}
            </menu>

        </div>
    );
}

export default GuiEditPanel;