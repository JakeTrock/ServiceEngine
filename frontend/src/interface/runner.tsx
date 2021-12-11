import React from "react";
import { toast } from 'react-toastify';
import './data/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import allutils from "./data/allutils";
import GuiRunner from "./subcomponents/interface/guiRunner";

//load metadata from fake database to build component, replace later with db call
const loadMetaData = (id) => {
    if (id) {
        const ut = allutils.filter(ut => ut.id === id);
        if (ut.length === 0) toast("Invalid utility ID!")
        return ut[0];
    } else toast.error("You must provide an id of a utility to load!")
};

const SvcPage = (props) => {
    const { match, location, history } = props;
    const utilID = match.params.uuid;
    const currentComponent = loadMetaData(utilID);//current component data
    return (
        <>
            <GuiRunner component={currentComponent} />
        </>
    );
};

export default SvcPage;