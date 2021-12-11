import React from "react";
import { toast } from "react-toastify";
import helpers from "../../data/helpers";

function MediaFrame(props) {
    // const { visible, hasVideo, hasControls, defaultSeek, media, width, height } = props.objProps;//TODO: add starttime, source
    // const hookset = React.useRef(null);

    // //attach hooks to html
    // React.useEffect(() => {
    //     const ohooks = props.objHooks;
    //     if (ohooks && ohooks !== {}) {
    //         //if object has hook kvp, loop thru and attach all functions from hooks to html object
    //         Object.entries(ohooks).forEach(([key, func]) => {//TODO:event for play finish?
    //             switch (key) {
    //                 case "change": (() => {
    //                     hookset.current.addEventListener("volumechange", () => (func as Function)({
    //                         muted: hookset.current.muted,
    //                         seeking: hookset.current.seeking,
    //                         src: hookset.current.currentSrc,
    //                         ended: hookset.current.ended,
    //                         time: hookset.current.currentTime,
    //                     }));
    //                     hookset.current.addEventListener("pause", () => (func as Function)({
    //                         muted: hookset.current.muted,
    //                         seeking: hookset.current.seeking,
    //                         src: hookset.current.currentSrc,
    //                         ended: hookset.current.ended,
    //                         time: hookset.current.currentTime,
    //                     }));
    //                     hookset.current.addEventListener("seeking", () => (func as Function)({
    //                         muted: hookset.current.muted,
    //                         seeking: hookset.current.seeking,
    //                         src: hookset.current.currentSrc,
    //                         ended: hookset.current.ended,
    //                         time: hookset.current.currentTime,
    //                     }));
    //                     hookset.current.addEventListener("ended", () => (func as Function)({
    //                         muted: hookset.current.muted,
    //                         seeking: hookset.current.seeking,
    //                         src: hookset.current.currentSrc,
    //                         ended: hookset.current.ended,
    //                         time: hookset.current.currentTime,
    //                     }));
    //                 })(); break;
    //                 case "clickIn": hookset.current.addEventListener("click", (e) => {
    //                     e.preventDefault();
    //                     const bcr = hookset.current!.getBoundingClientRect();
    //                     const x = e.pageX - bcr.right;
    //                     const y = e.pageY - bcr.top;
    //                     return (func as Function)({
    //                         muted: hookset.current.muted,
    //                         seeking: hookset.current.seeking,
    //                         src: hookset.current.currentSrc,
    //                         ended: hookset.current.ended,
    //                         time: hookset.current.currentTime,
    //                         x,
    //                         y,
    //                         value: [x, y]
    //                     })
    //                 }); break;
    //                 case "doubleClickIn": hookset.current.addEventListener("dblclick", (e) => {
    //                     e.preventDefault();
    //                     const bcr = hookset.current!.getBoundingClientRect();
    //                     const x = e.pageX - bcr.right;
    //                     const y = e.pageY - bcr.top;
    //                     return (func as Function)({
    //                         muted: hookset.current.muted,
    //                         seeking: hookset.current.seeking,
    //                         src: hookset.current.currentSrc,
    //                         ended: hookset.current.ended,
    //                         time: hookset.current.currentTime,
    //                         x,
    //                         y,
    //                         value: [x, y]
    //                     })
    //                 }); break;
    //                 case "clickOut": hookset.current.addEventListener("blur", (e) => {
    //                     e.preventDefault();
    //                     const bcr = hookset.current!.getBoundingClientRect();
    //                     const x = e.pageX - bcr.right;
    //                     const y = e.pageY - bcr.top;
    //                     return (func as Function)({
    //                         muted: hookset.current.muted,
    //                         seeking: hookset.current.seeking,
    //                         src: hookset.current.currentSrc,
    //                         ended: hookset.current.ended,
    //                         time: hookset.current.currentTime,
    //                         x,
    //                         y,
    //                         value: [x, y]
    //                     })
    //                 }); break;
    //                 case "mouseIn": hookset.current.addEventListener("mouseover", (e) => {
    //                     e.preventDefault();
    //                     const bcr = hookset.current!.getBoundingClientRect();
    //                     const x = e.pageX - bcr.right;
    //                     const y = e.pageY - bcr.top;
    //                     return (func as Function)({
    //                         muted: hookset.current.muted,
    //                         seeking: hookset.current.seeking,
    //                         src: hookset.current.currentSrc,
    //                         ended: hookset.current.ended,
    //                         time: hookset.current.currentTime,
    //                         x,
    //                         y,
    //                         value: [x, y]
    //                     })
    //                 }); break;
    //                 case "mouseOut": hookset.current.addEventListener("mouseout", (e) => {
    //                     e.preventDefault();
    //                     const bcr = hookset.current!.getBoundingClientRect();
    //                     const x = e.pageX - bcr.right;
    //                     const y = e.pageY - bcr.top;
    //                     return (func as Function)({
    //                         muted: hookset.current.muted,
    //                         seeking: hookset.current.seeking,
    //                         src: hookset.current.currentSrc,
    //                         ended: hookset.current.ended,
    //                         time: hookset.current.currentTime,
    //                         x,
    //                         y,
    //                         value: [x, y]
    //                     })
    //                 }); break;
    //                 case "load": (func as Function)({
    //                     src: hookset.current.currentSrc,
    //                     time: hookset.current.currentTime
    //                 }); break;
    //                 case "keyPressed": hookset.current.addEventListener("click", (e) => {
    //                     e.preventDefault();
    //                     const bcr = hookset.current!.getBoundingClientRect();
    //                     const x = e.pageX - bcr.right;
    //                     const y = e.pageY - bcr.top;
    //                     const kc = helpers.keycodetools(e)
    //                     return (func as Function)({
    //                         muted: hookset.current.muted,
    //                         seeking: hookset.current.seeking,
    //                         src: hookset.current.currentSrc,
    //                         ended: hookset.current.ended,
    //                         time: hookset.current.currentTime,
    //                         x,
    //                         y,
    //                         value: kc
    //                     })
    //                 }); break;
    //                 case "scroll": hookset.current.addEventListener("wheel", (e) => {
    //                     e.preventDefault();
    //                     const x = e.deltaX;
    //                     const y = e.deltaY;
    //                     return (func as Function)({
    //                         muted: hookset.current.muted,
    //                         seeking: hookset.current.seeking,
    //                         src: hookset.current.currentSrc,
    //                         ended: hookset.current.ended,
    //                         time: hookset.current.currentTime,
    //                         x,
    //                         y,
    //                         value: [x, y]
    //                     })
    //                 }); break;
    //                 default:
    //                     toast("invalid event type");
    //             }
    //         })
    //     }
    // }, []);
    // const id = props.uuid;

    // return (
    //     (hasVideo === "true") ? <video id={id} ref={hookset} style={{ visibility: helpers.toggleVis(visible), width, height }} controls={hasControls} /> :
    //         <audio id={id} ref={hookset} style={{ visibility: helpers.toggleVis(visible), width, height }} controls={hasControls} />
    // );

    return (<p>
        temporarily discontinued out of xss mitigation fears
    </p>)
}

export default MediaFrame;
//https://www.w3.org/2010/05/video/mediaevents.html