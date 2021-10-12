import * as React from "react";
import '../../data/tabs.css';

const Tab = (props) => {
    const { label, onClick, activeTab } = props;
    let className = 'tab-list-item';
    if (activeTab === label) {
        className += ' tab-list-active';
    }

    return (
        <li
            className={className}
            onClick={() => onClick(label)}
        >
            {label}
        </li>
    );
};

export default Tab;