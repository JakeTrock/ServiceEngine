import axios from "axios";
import * as React from "react";
import { FormButton, Holder, InputNorm } from "../../data/styles";
import FlexList from "./microcomps/flexlist";

export default (props) => {
    const [comps, setComps] = React.useState([]);
    const getFiles = async (ind) => {
        if (comps.length != 0) {
            const files = await comps.map(async (r) => {
                return axios({
                    url: r,
                    method: "GET",
                    responseType: "blob",
                }).then((response) => {
                    const url = (window.URL || window.webkitURL).createObjectURL(
                        new Blob([response.data])
                    );
                    const link = document.createElement("a");
                    link.href = url;
                    const fn = response.headers["content-disposition"].match(
                        /filename\s*=\s*"(.+)"/i
                    )[1];
                    const fcontent = new Blob([response.data]);
                    const newFile = new File([fcontent], fn);
                    return newFile;
                });
            });
            props.component.initParams.files = files;
            props.callback(props.component);
        }
    };
    return (
        <Holder>
            <FlexList component={props.component} callback={(r) => setComps(r.params)} />
            <FormButton onClick={() => getFiles(comps)}>Download All</FormButton>
        </Holder>
    );
};
