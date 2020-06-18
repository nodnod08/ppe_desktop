import React, { useState } from "react";

const HandleState = (value) => {
  const [state, setState] = useState(value);

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    });
  };

  const reset = (value) => {
    setState(value);
  };

  return [state, handleChange, reset];
};

export default HandleState;
