import React from "react";
import { toast } from 'react-toastify';
import '../../data/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import { hookCollection, IFaceBlock, libraryHook, utility } from "../../data/interfaces";
import GuiRender from "./guiRender";
import helpers from "../../data/helpers";


const prefixCB = "./programs/codeBlocks/";
const prefixGB = "./programs/glueBlocks/";

//loads all code when run button is pressed, 
const loadAll = async (component): Promise<hookCollection> => {
    try {
        const coreGlue = await import(`${prefixGB}${component.file}`);
        if (component.binariesUsed) {
            if (typeof SharedArrayBuffer === 'undefined') {
                const dummyMemory = new WebAssembly.Memory({ initial: 0, maximum: 0, shared: true });
                //@ts-ignore
                globalThis.SharedArrayBuffer = dummyMemory.buffer.constructor
            }
            const liblist = component.binariesUsed.map(o => import(`${prefixCB}${o}`));
            return Promise.all(liblist)
                .then(l => l.map(v => () => (v as libraryHook).default()))//stage init of all functions
                .then(l => Promise.all(l))//init all functions
                .then(l => helpers.asyncBuild(l, async (correspondingFunction, index, returned) => {
                    returned[component.binariesUsed[index]] = await correspondingFunction();
                })).then(libpreload => coreGlue.default({//load component into user code
                    libraries: libpreload
                }));
        } else {
            return coreGlue.default({});
        }
    } catch (e) {
        toast.error(e.toString());
    }
}

const GuiRunner = (props) => {
    const currentComponent: utility = props.component;//current component data
    const [exports, setExports] = React.useState<hookCollection>();//all references to functions in a dictionary so the gui can attach
    const [currentInterface, setCurrentInterface] = React.useState<IFaceBlock[] | []>(currentComponent.scheme);//current gui scheme

    //run loadall, pipe all hooks into the hook state so the form can attach
    const saveHooks = () => loadAll(currentComponent).then(cmpt => setExports(cmpt));

    return (
        <div id="helper">
            <Helmet>
                <title itemProp="name" lang="en">{currentComponent.name}</title>
                <meta name="keywords"
                    content={currentComponent.tags.join(" ")} />
                <meta name="description"
                    content={currentComponent.description} />
            </Helmet>
            <div id="serviceContainer">
                {(currentComponent.scheme && exports) ? <GuiRender scheme={currentInterface} setScheme={setCurrentInterface} exports={exports} /> :
                    <button className="smbutton" onClick={() => saveHooks()}>▶️ load and start program</button>}
            </div>
        </div>
    );
};

export default GuiRunner;