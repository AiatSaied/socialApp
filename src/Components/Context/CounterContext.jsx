import { createContext, useState } from "react";

export let CounterContext = createContext();

export function CounterContextProvider(props) {
  const [counter, setcounter] = useState(10);

  return (
    <CounterContext.Provider value={{ counter, setcounter /*{Shared Data}*/ }}>
      {props.children} {/* Component or App */}
    </CounterContext.Provider>
  );
}
