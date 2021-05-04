import MyStack from "./MyStack";
import * as sst from "@serverless-stack/resources";

export default function main(app: sst.App): void {
  // Set default runtime for all functions
  if (process.env.IS_LOCAL) {
    app.setDefaultFunctionProps({
      timeout: 30,
    });
  } else {
    app.setDefaultFunctionProps({
      runtime: "nodejs12.x",
    });
  }
  new MyStack(app, "my-stack");

  // Add more stacks
}


//TODO:https://serverless-stack.com/examples/how-to-debug-lambda-functions-with-visual-studio-code.html