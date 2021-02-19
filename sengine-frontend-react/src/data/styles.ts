import styled from "styled-components";
const Holder = styled.div`
  font-family: Helvetica Neue, sans-serif;
  max-width: 600px;
  margin: 100px auto;
  padding: 20px;

  &,
  & * {
    box-sizing: border-box;
  }
`;
const ServiceContainer = styled.div`
  border: 2px solid #ddd;
  outline: none;
`;
const ServiceBox = styled.div`
  border: 2px solid #ddd;
  outline: none;
  &:hover {
    border: 2px solid #ccf;
  }
`;
const Suggestion = styled.div`
  display: flex;
  font-size: 20px;
  align-items: baseline;
  padding: 10px 0;
  border: 1px solid #ddd;
  outline: none;
  &:hover {
    border: 2px solid #ccf;
    border-left 5px solid #ccf;
  }
`;
const IntroHolder = styled.div`
  padding: 20px 0;
  font-weight: bold;
  opacity: 0.2;
  font-family: inherit;
`;
const SearchFormHolder = styled.div``;
const ResultsHolder = styled.div`
  border: 2px solid #ddd;
  outline: none;
`;
const SearchInput = styled.input`
  display: block;
  width: 100%;
  padding: 25px;
  font: inherit;
  font-weight: bold;
  font-size: 30px;
  border: 2px solid #ddd;
  outline: none;

  &:focus {
    border-color: #bbb;
  }
`;
const PlusButton = styled.a`
  text-align: center;
  background: lightgreen;
  display: block;
  width: 100%;
  padding: 25px;
  font: inherit;
  font-weight: bold;
  font-size: 30px;
  border: 2px solid #ddd;
  outline: none;
  color: white;

  &:hover {
    border-color: #bbb;
  }
`;
const DoneButton = styled.a`
  text-align: center;
  font: inherit;
  display: inline-block;
  border-radius: 5px;
  padding: 0.5rem 0;
  margin: 0.5rem 1rem;
  width: 11rem;
  background: lightgreen;
  color: white;
  border: 2px solid lightgreen;
  &:hover {
    border: 2px solid green;
  }
`;
const Error = styled.div`
  font: inherit;
  display: inline-block;
  margin: 0.5rem 1rem;
  background: rgba(255, 0, 0, 0.4);
  color: black;
  border-radius: 5px;
  width: 100%;
  opacity: 0.4;
  padding: 5px;
  font: inherit;
  font-weight: bold;
  font-size: 0.8em;
  border: 1px solid red;
  outline: none;
`;

const TimeDisp = styled.h1`
  color: #000;
  font: inherit;
  font-weight: bold;
  font-size: 30px;
`;

const TimeInput = styled.input`
  width: 15%;
  border: none;
  font: inherit;
  font-weight: bold;
  font-size: 30px;
  border-bottom: 1.5px solid #000;
  &:hover {
    border-bottom: 3px solid #000;
  }
`;

const FormButton = styled.a`
  text-align: center;
  font: inherit;
  display: inline-block;
  border-radius: 5px;
  padding: 0.3rem 0.5rem;
  margin: 0.5rem 1rem;
  background: lightgreen;
  color: white;
  border: 2px solid lightgreen;
  &:hover {
    border: 2px solid lightgray;
  }
`;

const FileInput = styled.input`
  border: none;
  font: inherit;
  font-weight: bold;
  font-size: 15px;
  border-bottom: 1.5px solid #000;
  &:hover {
    border-bottom: 3px solid #000;
  }
`;

const Header = styled.h1`
  color: #000;
  font: inherit;
  font-weight: bold;
  font-size: 30px;
`;

const Dialogue = styled.div`
  display: none;
  position: fixed;
  z-index: 1;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  border: 2px solid #ddd;
`;

const DialogueChild = styled.div`
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
`;

const CloseButton = styled.span`
  content: "&times;";
  color: #aaaaaa;
  float: right;
  font-size: 30px;
  font-weight: bold;
`;

export {
  Holder,
  ServiceContainer,
  ServiceBox,
  Suggestion,
  IntroHolder,
  SearchFormHolder,
  ResultsHolder,
  SearchInput,
  DoneButton,
  PlusButton,
  Error,
  TimeDisp,
  TimeInput,
  FormButton,
  FileInput,
  Header,
  Dialogue,
  DialogueChild,
  CloseButton,
};
