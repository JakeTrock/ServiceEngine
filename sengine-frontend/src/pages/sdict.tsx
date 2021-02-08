import * as React from "react";
import { ValidComponent } from "../data/interfaces";

const sLoader = (toLoad: string[], context) => {
  const cList = toLoad.map((c) =>
    React.lazy(() => import(`./components/${c}`))
  );
  const First = cList[0];
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <First
        component={context.vals}
        children={cList.shift()}
        callback={context.callback}
      />
    </React.Suspense>
  );
};

const sdict: {
  [uuid: string]: (componentCtx: ValidComponent) => JSX.Element;
} = {
  "u-u-i-d-1": (c) => sLoader(["timer"], c),
  "u-u-i-d-2": (c) => sLoader(["uploader", "multiloader", "crop"], c),
};

export default sdict;
