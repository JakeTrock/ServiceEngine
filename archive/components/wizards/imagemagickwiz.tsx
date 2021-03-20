// https://www.npmjs.com/package/wasm-imagemagick
import * as React from "react";
import { FormButton, Holder } from "../../../data/styles";
import { call } from "wasm-imagemagick";

export default (props) => {
  const Child = props.children[0];
  const [customComp, setCustomComp] = React.useState(props.component);

  const runConv = async (input) => {
    console.log(input.params.length);
    const images = await input.initParams.files.map(async (f, i) => {
      const content = new Uint8Array(f.arrayBuffer()); //TODO:not sure if this will go thru right
      const image = { name: f.name, content };
      if (input.params.length > 1) {
        const n = Object.keys(input.params[i])[0];
        const command = ["convert", "$INPUT", "-" + n, input.params[i][n], "%d"];
        console.log(command);
        const result = await call([image], command);
        console.log(result);

        if (result.exitCode !== 0)
          return alert("There was an error: " + result.stderr.join("\n"));

        return result.outputFiles;
      } else return image;
    });
    if (input.params.length == 1) {
      const n = Object.keys(input.params[0])[0];
      const command = ["convert", "$INPUT", n, input.params[0][n], "%d"];
      console.log(command);
      const result = await call([images], command);
      console.log(result);
      if (result.exitCode !== 0)
        return alert("There was an error: " + result.stderr.join("\n"));

      input.initParams.files = result.outputFiles;
    } else {
      input.initParams.files = images;
    }
    return input;
  };
  // TODO:might need a loady bar
  return (
    <Holder>
      <Child
        component={props.component}
        children={props.children.splice(1)}
        callback={(v) => setCustomComp(v)}
      />
      <FormButton
        onClick={async () => {
          const tmp = await runConv(customComp);
          console.log(tmp);
          props.callback(tmp);
        }}
      >
        Apply
      </FormButton>
    </Holder>
  );
};
