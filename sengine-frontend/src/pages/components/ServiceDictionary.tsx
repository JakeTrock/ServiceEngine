const persons: { [uuid: string]: Function } = {
  "u-u-i-d": function Result({ match }: Props) {
    return (
      <Holder>
        {match.parts.map((part, index) => {
          return (
            <ResultPart key={index} type={part.type}>
              {part.content}
            </ResultPart>
          );
        })}
      </Holder>
    );
  },
};
export default persons;
