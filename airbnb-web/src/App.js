import React, { useState, useEffect } from "react";
import { fetchData } from "./actions/fetch";
import { useDispatch } from "react-redux";

const App = () => {
  // Setting Dispatch
  const dispatch = useDispatch();

  // Dummy text data
  const [messages, setMessages] = useState(null);

  // Dispatching our first action
  useEffect(() => {
    dispatch(fetchData(setMessages));
  }, []);

  // Building Layout
  return (
    <div className="app">
      <h1>Application is Running!</h1>
      {messages ? (
        <>
          <p>{messages.message}</p>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default App;
