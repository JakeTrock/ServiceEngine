import * as React from "react";
import { ValidComponent } from "../interfaces";
import { Holder } from "../styles";

const ServiceDictionary: {
  [uuid: string]: (componentCtx: ValidComponent) => JSX.Element;
} = {
  "u-u-i-d": function Result(componentCtx: ValidComponent) {
    return <Holder>{componentCtx.serviceUUID}</Holder>;
  },
};
export default ServiceDictionary;
