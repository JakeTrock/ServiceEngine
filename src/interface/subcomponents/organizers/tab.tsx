import * as React from "react";

const Tab = (props) => {
    const { label, onClick, activeTab } = props;
    let className = 'bg-white inline-block rounded-t py-2 px-4 hover:text-purple-500 focus:outline-none';
    if (activeTab === label) {
        className = 'bg-white inline-block border-b-2 py-2 px-4 hover:text-blue-darker font-semibold hover:text-purple-500 focus:outline-none';
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
