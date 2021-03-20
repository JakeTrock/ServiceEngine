//https://www.npmjs.com/package/jszip
import * as React from "react";
import { FormButton, Holder } from "../../../data/styles";
import jszip from 'jszip';

export default (props) => {
    const Child = props.children[0];
    const [customComp, setCustomComp] = React.useState(props.component);


    const compress = async (input) => {
        const fm = (input.params.length > 1) ? await input.initParams.files.map(async (f, i) => {
            let zip = new jszip();
            zip.file(f.name, f.stream);

            const file = await zip.generateAsync({ type: "blob" });
            return new File([file], input.params[i].zname);
        }) : async () => {
            let zip = new jszip();
            await input.initParams.files.map(async (f) => zip.file(f.name, f.stream));
            const file = await zip.generateAsync({ type: "blob" });
            return [new File([file], input.params[0].zname)];
        };
        input.initParams.files=fm;
        input.satisfied=true;
        return input;
    };
    // TODO:might need a loady bar
    let cmod = props.component;
    console.log(props.component);
    cmod.params = props.component.initParams.files.map(f => f.name);
    return (
        <Holder>
            <Child
                component={cmod}
                children={props.children.splice(1)}
                callback={(v) => setCustomComp(v)}
            />
            <FormButton onClick={async () => {
                console.log(customComp);
                const tmp = await compress(customComp);
                console.log(tmp);
                props.callback(tmp);
            }}>Compress</FormButton>
        </Holder>
    );
};
