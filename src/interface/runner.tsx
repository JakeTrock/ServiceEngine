/*
SEO optimize subpages
what the engines like:
>ppl linking to you with similar text describing the link
>on-page
  >descriptive title tags
  >descriptive h1/h2/h3 tags
  >^these are prioritized if rendered on first contentful paint
  >fast loadtimes and good lighthouse scores
  >they dont care about currentComponent tags

TODO:https://reactgo.com/react-seo-helmet/
TODO:https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap#addsitemap
gen sm from db uuids?
*/
import React from "react";
import { toast } from 'react-toastify';
import './data/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import { exportCollection, IFaceBlock, util } from "./data/interfaces";
import Collapsible from "./subcomponents/organizers/collapsible";
import { wasmLoader } from "./data/wasmLoader";
import GuiRender from "./subcomponents/guiRender";
import reportReasons from "./data/reportReasons";
// import { createReport } from "../graphql/mutations";
// import { API, graphqlOperation } from "aws-amplify";

const SvcPage = (props) => {
    const { match, location, history } = props;
    const utilID = match.params.uuid;
    const uinfo = props.userInfo;
    const [currentComponent, setCurrentComponent] = React.useState<util>();
    const [currentInterface, setCurrentInterface] = React.useState<IFaceBlock[]>();
    const [exports, setExports] = React.useState<exportCollection>();

    React.useEffect(() => {//appends current form values to url so they can be shared
        if (currentComponent) {
            // const vkey = Object.keys(currentComponent.form.currentFormData);
            let hobj = {};
            if (currentComponent) {
                hobj["svc"] = currentComponent.id;//set current service uuid in url too so that the service is preserved
                // setcurrentComponent({});//TODO:get gui currentComponentdata from uuid, else toast error

                // if (vkey.length) {
                //     vkey.forEach(function (key) {
                //         hobj[key] = currentComponent.form.currentFormData[key];
                //     });
                // }
                //TODO: append current values to history
                history.push(hobj);
            }
        }
    }, [currentComponent]);

    //runs when the page loads
    React.useEffect(() => {
        // //TODO: fetch curr component here
        //     .then((cmp) => {
        //         // if (match.params.length > 1) {
        //         //     let cvls = match.params;
        //         //     delete cvls["svc"];
        //         //     cmp.form.currentFormData = cvls;
        //         // }
        //         setCurrentComponent(cmp);
        //     });
    }, []);

    //report a util if logged in
    const reportUtil = async (rptval, tbval) => {
        try {
            // await API.graphql(graphqlOperation(createReport, {
            //     reason: reportBox.current.value,
            //     reportReportedById: userToken.userSub,
            //     reportUtilId: utilID,
            // }));
            // await API.graphql(graphqlOperation(updateUser, {
            //     $input: {
            //         reason: reportBox.current.value,
            //         reportReportedById: userToken.userSub,
            //         reportUtilId: utilID,
            //     },
            //     $condition: {
            //         username: userToken.username
            //     }
            // }));
            // toast("Successfully Reported Utility")
        } catch (e) {
            toast(e);
        }
    };

    //like a util if logged in
    const likeUtil = async () => {
        try {
            // await API.graphql(graphqlOperation(createReport, {
            //     reason: reportBox.current.value,
            //     reportReportedById: userToken.userSub,
            //     reportUtilId: utilID,
            // }));
            // toast("Successfully Liked Utility")
        } catch (e) {
            toast(e);
        }
    };

    //handle form error
    const handleErr = (e) => toast(e);

    const loadAll = async () => {
        if (currentComponent) {
            try {
                const item = await fetch("/utils/load/" + currentComponent.id);
                if (item && item.ok) {
                    const jsonitm: util = item.json() as unknown as util;
                    const { permissions, owner, approved, libraries } = jsonitm;
                    //set current form to the form stored in s3
                    const form = await fetch(`${owner}/${currentComponent.id}/iface.json`).then((d) =>
                        d.json()
                    );
                    if (!approved) handleErr("warning, this utility is not yet approved! Continue at your own risk and do not put in any sensitive credentials!");
                    setCurrentInterface(form);
                    wasmLoader(permissions, libraries).then(cmpt => setExports(cmpt))
                } else throw new Error("unable to find component data!");
            } catch (e) {
                handleErr(e);
            }
        }
    }

    return (
        <div id="helper">
            <Helmet>
                <title itemProp="name" lang="en">{currentComponent.title}</title>
                <meta name="keywords"
                    content={currentComponent.tags.join(" ")} />
                <meta name="description"
                    content={currentComponent.description} />
            </Helmet>
            <div id="serviceContainer">
                {(currentInterface && exports) ? <GuiRender schema={currentInterface} controllerFunctions={(evtname, e) =>
                    exports[evtname].function(e)//TODO: this is a clear security vuln for exfil
                } /> : <button onClick={() => loadAll()}>▶️ load and start program</button>}
            </div>
            <p>{`Last updated by ${currentComponent.updatedAt} by ${currentComponent.owner} and used ${currentComponent.numUses} times`}</p>
            <button onClick={() => likeUtil()} disabled={!(!uinfo)}>Like({currentComponent.numLikes})</button>
            {uinfo &&
                <div>
                    <h6>Report utility</h6>
                    <Collapsible>
                        <p>* Chose reason to report utility:</p>
                        <select>
                            {reportReasons.map((lbl, i) => (
                                <option key={i} value={lbl}>{lbl}</option>
                            ))}
                        </select>
                        <p>Elaborate on why you reported(optional):</p>
                        <textarea></textarea>
                        <button type="button" onClick={(e) => {
                            //@ts-ignore
                            const rptval = e.currentTarget.parentNode.childNodes.item(0).value;
                            if (rptval !== "") {
                                //@ts-ignore
                                const tbval = e.currentTarget.parentNode.childNodes.item(1).value;
                                reportUtil(rptval, tbval);
                                //@ts-ignore
                                e.currentTarget.parentNode.childNodes.item(0).value = e.currentTarget.parentNode.childNodes.item(1).value = "";
                            } else handleErr("You must choose a reason to report this utility!");
                        }}>Report</button>
                    </Collapsible>
                </div>}
            <h6>Share utility</h6>
            <Collapsible>
                <input type="text" value={window.location.href}></input>
            </Collapsible>
        </div>
    );
};

export default SvcPage;