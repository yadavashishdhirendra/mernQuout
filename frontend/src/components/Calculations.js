import React, { useState } from 'react'

const Calculations = () => {
  const [count, setCount] = useState(0);

  function brokenIncrement() {
    setCount(count + 1);
    setCount(count + 1);
  }

  function increment() {
    setCount(count => count + 1);
  }

  return (
    <div style={{marginTop: "10rem"}}>
      <div>{count}</div>
      <button onClick={brokenIncrement}>Broken increment</button>
      <button onClick={increment}>Increment</button>
    </div>
  )
}

export default Calculations