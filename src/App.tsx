import React, { useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  Button,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormControl,
} from "@material-ui/core";
import Container from "react-bootstrap/esm/Container";
import { Alert, Col, Row } from "react-bootstrap";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import client from "./Client";
import { useEffect } from "react";

let uniqueId: number = 0;
function createid(): string {
  return (uniqueId++).toString();
}

interface ColumnParame {
  id: string;
  type: "number";
  name: string;
}

interface AlertMessageProps {
  onClosed: () => void;
  data: AlertData;
}

function AlertMessage(props: AlertMessageProps) {
  const data = props.data;
  const _onClosed = props.onClosed;
  useEffect(() => {
    console.log("setTimeout");
    const id = setTimeout(() => {
      if (_onClosed) _onClosed();
    }, 5000);

    return () => clearTimeout(id);
  }, []);

  const handleOnClose = () => {
    if (_onClosed) _onClosed();
  };
  return (
    <div style={{ width: "100%" }}>
      {data.type === "success" ? (
        <Alert variant="success" dismissible onClose={handleOnClose}>
          {data.message}
        </Alert>
      ) : (
        <Alert variant="danger" dismissible onClose={handleOnClose}>
          {data.message}
        </Alert>
      )}
    </div>
  );
}
interface AlertData {
  id: string;
  type: "success" | "error";
  message: string;
}

function App() {
  const [result, setResult] = useState("");
  const [count, setCount] = useState("0");
  const [params, setParams] = useState<ColumnParame[]>([]);
  // const [alerts, setAlerts] = useState<{ [id: string]: AlertData }>({});
  const alerts = useRef<{ [id: string]: AlertData | undefined }>({});
  const [alertUpdate, setAlertUpdate] = useState("");

  const isCountError = !/^\d+$/.test(count);

  const handleOnCreateClick = async () => {
    try {
      const csv = await client.getCsv();
      setResult(csv);

      const id = createid();
      alerts.current[id] = {
        id: id,
        type: "success",
        message: "CSV を作成しました",
      };
      setAlertUpdate(id);
    } catch (err) {
      console.log(err);
      const id = createid();
      alerts.current[id] = {
        id: id,
        type: "error",
        message: err.toString(),
      };
      setAlertUpdate(id);
    }
  };
  const handleOnCountChange = (event: any) => {
    setCount(event.target.value);
  };

  const handleOnAddClick = () => {
    const newParams = [...params];
    newParams.push({
      id: createid(),
      type: "number",
      name: "",
    });
    setParams(newParams);
  };
  useEffect(() => {
    const newAlerts: { [id: string]: AlertData | undefined } = {};
    Object.entries(alerts.current).forEach(([id, a]) => {
      if (a === undefined) return;
      newAlerts[id] = a;
    });
    alerts.current = newAlerts;
  }, [alertUpdate]);

  return (
    <div className="App">
      <form>
        <Container>
          {params.map((p, index) => {
            const handleOnDeleteClick = () => {
              const newParams = [...params];
              newParams.splice(index, 1);
              setParams(newParams);
            };
            const inputLabelId = "select-name-" + index.toString();

            const handleOnTypeChange = (event: any) => {
              const type = event.target.value;
              const newParams = [...params];
              newParams[index].type = type;
              setParams(newParams);
            };
            const handleOnNameChange = (event: any) => {
              const name = event.target.value;
              const newParams = [...params];
              newParams[index].name = name;
              setParams(newParams);
            };
            return (
              <Row key={p.id}>
                <Col xs={3}>
                  <FormControl>
                    <InputLabel id={inputLabelId}>Type</InputLabel>
                    <Select
                      fullWidth
                      labelId={inputLabelId}
                      value={p.type}
                      onChange={handleOnTypeChange}
                    >
                      <MenuItem value="number">Number</MenuItem>
                    </Select>
                  </FormControl>
                </Col>
                <Col xs={4}>
                  <TextField
                    label="Name"
                    value={p.name}
                    onChange={handleOnNameChange}
                  />
                </Col>
                <Col xs={4}>
                  <IconButton onClick={handleOnDeleteClick}>
                    <DeleteForeverIcon />
                  </IconButton>
                </Col>
              </Row>
            );
          })}
          <Row>
            <Col>
              <IconButton onClick={handleOnAddClick}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Col>
          </Row>
          <Row>
            <Col>
              <TextField
                multiline
                label="作成データ数"
                value={count}
                onChange={handleOnCountChange}
                error={isCountError}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button onClick={handleOnCreateClick} variant="outlined">
                作成
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <TextField
                fullWidth
                multiline
                variant="outlined"
                label="結果"
                value={result}
              />
            </Col>
          </Row>
          {Object.entries(alerts.current)
            .map(([id, a]) => {
              return { id, a };
            })
            .filter((d) => d.a !== undefined)
            .map((d) => {
              const handleOnAlertClosed = () => {
                alerts.current[d.id] = undefined;

                setAlertUpdate(d.id + "_delete");
              };
              return d.a !== undefined ? (
                <Row key={d.id}>
                  <Col>
                    <AlertMessage onClosed={handleOnAlertClosed} data={d.a} />
                  </Col>
                </Row>
              ) : (
                <></>
              );
            })}
        </Container>
      </form>
    </div>
  );
}

export default App;
