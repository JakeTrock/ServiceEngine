import * as React from "react";
import '../../../data/tabs.css';

const PlusTab = (props) => {
    const { label, onClick, activeTab } = props;
    const newName = React.useRef(null);
    let className = 'tab-list-item';
    if (activeTab === label) {
        className += ' tab-list-active';
    }

    return (
        <li
            className={className}
            onClick={() => onClick(newName)}
        >
            <input ref={newName}></input>+
        </li>
    );
};

export default PlusTab;