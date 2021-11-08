import React from "react";
import { compDict } from "../compDict";
import FailComponent from "./failComponent";
import '../../../../data/tabs.css';

function TabbedView(props) {
    const { visible, labels, width, height, childNodes } = props.objProps;
    const id = props.uuid;
    const [activeTab, setActiveTab] = React.useState<string>(labels[0]);
    const vis = () => (visible === false) ? "hidden" : "visible";
    const hookset = React.useRef(null);
    //attach hooks to html
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, value]) => {
                hookset.current.addEventListener(key, () => (value as Function)());
            })
        }
    }, []);

    return (
        <div className="tabs">
            <ol className="tab-list">
                {labels.map((lbl) => <li
                    className={activeTab === lbl ? 'tab-list-item tab-list-active' : 'tab-list-item'}
                    onClick={() => setActiveTab(lbl)}
                    key={id + lbl}
                >
                    {lbl}
                </li>)}
            </ol>


            <div id={id} ref={hookset} style={{ display: "flex", overflow: "scroll", visibility: vis(), width, height }}>
                {childNodes && childNodes !== [] && childNodes.map((node, i) => labels.indexOf(activeTab) == i && (
                    <React.Fragment key={id + i}>
                        {node.map((el, j) => (React.createElement(compDict[el.id] || FailComponent,
                            { key: id + (i + el.id + j), uuid: el.uuid, objProps: el.defaults, objHooks: el.hooks, validate: el.validate }))
                        )}
                        < br />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default TabbedView;