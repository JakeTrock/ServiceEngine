import * as React from "react";
import MonacoEditor from "react-monaco-editor";
import { toast } from "react-toastify";
import extToLang from "../../../data/extToLang";
import '../../../data/tabs.css';
import Tab from "./tab";

const TabbedEditor = (props) => {
    const [activeTab, setActiveTab] = React.useState<Number>(0);

    const addTab = (name) => {
        if (name.indexOf(".") == -1) return toast("please put a period in the name to seperate the extension. If this is a file like readme with no extension, please use .txt");
        props.scnames.push(name);
        props.setScnames(props.scnames);
        props.sccontent.push("");
        props.setSccontent(props.sccontent);
    };

    const updCmp = (txt) => {
        props.sccontent[activeTab] = txt;
        props.setSccontent(props.sccontent);
        props.applySrc();
    };

    return (
        <div className="tabs">
            <ol className="tab-list">
                {props.scnames.map((label, i) => {
                    return (
                        <Tab
                            activeTab={activeTab}
                            key={label}
                            label={label}
                            onClick={() => setActiveTab(i)}
                        />
                    );
                })}
                <Tab
                    activeTab={activeTab}
                    label="+"
                    onClick={addTab}
                />
            </ol>
            <div className="tab-content">
                <MonacoEditor
                    width="100%"
                    height="50em"
                    language={extToLang[props.scnames[activeTab].slice(-1)[0]] || "text"}
                    theme="vs-light"
                    value={extToLang[props.sccontent[activeTab]]}
                    options={props.mcopt}
                    onChange={updCmp}
                />
            </div>
        </div>
    );
};

export default TabbedEditor;