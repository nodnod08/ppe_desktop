import { useState } from "react";

const useToggle = (value) => {
  const [state, setState] = useState(value);

  const setToggle = () => {
    setState(!state);
  };

  return [state, setToggle];
};

export default useToggle;
