import * as React from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import helpers from "../../data/helpers";
import { hookCollection, IFaceBlock, libraryHook, utility } from "../../data/interfaces";
import GuiRender from "./guiRender";

const spld = '(()=>{window.glue=undefined; window.mods=[]; window.addmodule=(module)=>{window.mods=[...window.mods,module]};})();';

const prefix = "http://localhost:8080/hosted/";

const prefixGB = `${prefix}glue/`;
const prefixCB = `${prefix}libraries/`;

const GuiRunner = (props) => {
    const currentComponent: utility = props.component;//current component data
    const [exports, setExports] = React.useState<hookCollection>();//all references to functions in a dictionary so the gui can attach
    const [currentInterface, setCurrentInterface] = React.useState<IFaceBlock[] | []>(currentComponent.scheme);//current gui scheme

    //props.glue
    const glue = `${prefixGB}${currentComponent.file}.js`;
    //props.sources
    const extsrc = currentComponent.binariesUsed.map(s => { return { "type": "text/javascript", src: `${prefixCB}${s}/main.js` }; });

    let handleScriptInject = ({ scriptTags }) => {
        if (scriptTags) {
            const scriptTag = scriptTags[scriptTags.length - 1];
            scriptTag.onload = () => {
                //@ts-ignore
                if (window.glue) {
                    try {
                        //@ts-ignore
                        const coreGlue = window.glue;
                        //@ts-ignore
                        if (currentComponent.binariesUsed && window.mods.length === currentComponent.binariesUsed.length) {
                            if (typeof SharedArrayBuffer === 'undefined') {
                                const dummyMemory = new WebAssembly.Memory({ initial: 0, maximum: 0, shared: true });
                                //@ts-ignore
                                globalThis.SharedArrayBuffer = dummyMemory.buffer.constructor
                            }
                            //@ts-ignore
                            const liblist = window.mods;


                            helpers.asyncMap(liblist, async (correspondingFunction, index, returned) => {
                                returned[currentComponent.binariesUsed[index]] = await correspondingFunction();
                            }).then(libpreload => coreGlue({//load component into user code
                                libraries: libpreload
                            })).then(libsall => setExports(libsall));
                        } else {
                            return coreGlue({});
                        }
                    } catch (e) {
                        toast.error(e.toString());
                    }
                }
            };
        }
    }
    handleScriptInject = handleScriptInject.bind(this);

    return (<div>
        {/* Load the myExternalLib.js library. */}
        <Helmet
            script={[{ "type": "text/javascript", innerHTML: spld }, { "type": "text/javascript", src: glue }, ...extsrc]}
            // Helmet doesn't support `onload` in script objects so we have to hack in our own
            onChangeClientState={(newState, addedTags) => handleScriptInject(addedTags)}
        />
        <div>
            <div id="helper">
                <Helmet>
                    <title itemProp="name" lang="en">{currentComponent.name}</title>
                    <meta name="keywords"
                        content={currentComponent.tags.join(" ")} />
                    <meta name="description"
                        content={currentComponent.description} />
                </Helmet>
                <div className="border-solid border-2" style={{ borderColor: "rgba(221, 221, 221, 1)", outline: "none" }}>
                    {(currentComponent.scheme && exports) && <GuiRender scheme={currentInterface} setScheme={setCurrentInterface} exports={exports} />}
                </div>
            </div>
        </div>
    </div>);

}

export default GuiRunner;