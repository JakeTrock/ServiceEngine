const toggleVis = (visible: boolean): import("csstype").Property.Visibility =>
  visible === false ? "hidden" : "visible";

export default { toggleVis };
