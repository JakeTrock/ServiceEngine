import * as React from "react";
import {
  Holder,
} from '../styles';

const persons: { [uuid: string]: Function } = {
  "u-u-i-d": function () {
    return <Holder>test</Holder>;
  },
};
export default persons;
