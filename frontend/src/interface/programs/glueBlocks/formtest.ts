const glcode = (imports) => {
  //object containing functions which attach to the form
  return {
    returnDat: (event, formAccess, additional, notify) => {
      console.log(event);
      console.log(JSON.stringify(event));
      // console.log(event.target.value||event);
    },
  };
};

export default glcode;
