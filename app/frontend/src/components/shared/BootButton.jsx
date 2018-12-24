import styled from "styled-components";

export default styled.button`
   {
    padding: 6px 8px;
    color: white;
    font-family: "Poppins";
    font-weight: 200;
    font-size: 1em;
    border-radius: 4px;
    background-color: var(--main-dark);
    outline: none;
    text-transform: uppercase;
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);

    :hover {
      cursor: pointer;
      background-image: linear-gradient(#717d7d, #8b9696, #a6afaf);
    }
  }
`;
