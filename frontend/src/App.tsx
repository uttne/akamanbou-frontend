import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button, TextField } from "@material-ui/core";

function App() {
  const [result, setResult] = useState("");
  const [count, setCount] = useState("0");

  const isCountError = !/^\d+$/.test(count);

  const handleOnCreateClick = () => {
    setResult(new Date().toString());
  };
  const handleOnCountChange = (event: any) => {
    setCount(event.target.value);
  };
  return (
    <div className="App">
      <div>
        <form>
          <div>
            <div>
              <TextField
                multiline
                label="作成データ数"
                value={count}
                onChange={handleOnCountChange}
                error={isCountError}
              />
            </div>
          </div>
          <div>
            <TextField
              multiline
              variant="outlined"
              label="結果"
              value={result}
            />
          </div>
        </form>
      </div>
      <div>
        <Button onClick={handleOnCreateClick}>作成</Button>
      </div>
    </div>
  );
}

export default App;
