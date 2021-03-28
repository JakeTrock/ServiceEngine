const [errList, setErrList] = React.useState<[subel] | []>([]);

{errList.length > 0 && (
    <Holder>//TODO:add errlist component
      {errList.map((result, index) => {
        return (
          <Error key={index}>
            {result.message}
            {result.stack && <Error>{result.stack}</Error>}
          </Error>
        );
      })}
    </Holder>
  )}