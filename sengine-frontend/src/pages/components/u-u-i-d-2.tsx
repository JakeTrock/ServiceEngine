import * as React from "react";
import { FileInput, FormButton, Holder } from "../../data/styles";
import fdict from "../../data/dicts/ftypedict";

export default class Uploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      customProp: {},
      child: React.lazy(
        () =>
          import(`./subcomponents/${this.props.component.params.uplSubType}`) //Bad practice?
      ),
    };
  }
  setCustom(input) {
    this.setState({
      customProp: input,
    });
  }
  parseFiles(data) {
    let fileArray = [];
    if (
      this.props.component.numFilesAllowed == -1 ||
      data.length - 1 < this.props.component.numFilesAllowed ||
      data.length == this.props.component.numFilesAllowed ||
      data.length > 0
    ) {
      Array.from(data).forEach((e: any) => {
        if (e.size < 536870912) {
          if (
            fdict[this.props.component.params.ftypeskey].some(
              (t) => t == e.type.split("/")[1]
            )
          ) {
            if (e.name.split(".")[1] == e.type.split("/")[1]) {
              fileArray.push(e);
            } else alert("filetype must match filename for file " + e.name);
          } else
            alert(
              `we do not accept the filetype ${
                e.type.split("/")[1]
              } for this converter`
            );
        } else alert("file is over our size limit(512mb)");
        if (fileArray != [])
          this.setState({
            files: fileArray,
          });
      });
    } else
      alert(
        `you are over the file limit, you can only upload ${this.props.numFilesAllowed} files`
      );
  }
  render() {
    return (
      <Holder>
        <FileInput
          type="file"
          multiple={this.props.component.params.allowMultiFile || false}
          onChange={(e) => this.parseFiles(e.target.files)}
        />
        <React.Suspense fallback={<div>Loading...</div>}>
          <this.state.child
            files={this.state.files}
            info={{ ftypes: fdict[this.props.component.params.ftypeskey] }}
            callback={(f) => {
              this.setCustom(f);
            }}
          />
        </React.Suspense>
        <FormButton
          onClick={() => {
            let tmp = {
              files: this.state.files,
            };
            tmp[this.props.component.params.uplSubType] = this.state.customProp;
            this.props.callback(tmp);
          }}
        >
          Upload file(s)
        </FormButton>
      </Holder>
    );
  }
}
