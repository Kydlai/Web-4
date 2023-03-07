import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Card } from "primereact/card";
import { InputNumber } from "primereact/inputnumber";
import { Slider } from "primereact/slider";
import { Button } from 'primereact/button';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import * as api from "./api";
import { resetCredentials } from "./store"

function MainPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const svgElement = useRef(null);
  const [coordX, setCoordX] = useState(0);
  const [coordY, setCoordY] = useState(0);
  const [radius, setRadius] = useState(1);
  const [phantomCoords, setPhantomCoords] = useState({ x: -999, y: -999 });
  const [data, setData] = useState([]);

  function getCoords(event) {
    let rect = svgElement.current.getBoundingClientRect();
    let x = (event.clientX - rect.left - 150) / 100 * radius;
    let y = (event.clientY - rect.top - 150) / -100 * radius;
    x = Math.min(3, Math.max(-5, Math.round(x * 1000) / 1000));
    y = Math.min(5, Math.max(-3, Math.round(y * 1000) / 1000));
    return { x, y }
  }

  async function onGraphClick(event) {
    let { x, y } = getCoords(event);
    setCoordX(Math.round(x));
    setCoordY(y);
    await addPoint(x, y);
  }

  async function addPoint(x, y) {
    let point = await api.addPoint(x, y, radius);
    setData([point, ...data]);
  }

  async function deletePoints() {
    await api.deletePoints();
    setData([]);
  }

  async function onMouseMove(event) {
    setPhantomCoords(getCoords(event));
  }

  async function onMouseLeave(event) {
    setPhantomCoords({ x: -999, y: -999 })
  }

  function logout() {
    dispatch(resetCredentials());
    navigate("/");
  }

  useEffect(() => {
    async function load() {
      try {
        let points = await api.getPoints();
        setData(points);
      } catch (err) {
        if (err == 401) navigate("/");
      }
    }
    load();
    let timer = setInterval(load, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="app-container">
      <div className="flex flex-row justify-content-between">
        <div>Кудлай Никита Романович, P32141, вариант 14667</div>
        <div className="logout" onClick={logout}>Выйти</div>
      </div>
      <div className="flex flex-row gap-3 map-row">
        <Card className="flex-auto" footer={
          <div className="flex flex-row gap-2 justify-content-end">
            <Button label="Очистить" onClick={deletePoints} severity="danger" outlined/>
            <Button label="Добавить" onClick={() => addPoint(coordX, coordY)}/>
          </div>
        }>
          <div className="flex flex-column gap-3">
            <div className="flex flex-column gap-2">
              <div>Координата X</div>
              <InputNumber min={-5} max={3} showButtons value={coordX} onValueChange={(e) => setCoordX(e.value || 0)}/>
            </div>
            <div className="flex flex-column gap-2">
              <div>Координата Y: {coordY}</div>
              <Slider min={-3} max={5} step={0.001} value={coordY} onChange={(e) => setCoordY(e.value)}/>
            </div>
            <div className="flex flex-column gap-2">
              <div>Радиус</div>
              <InputNumber min={-5} max={3} showButtons value={radius} onValueChange={(e) => {e.value = e.value < 1 ? 1 : e.value; setRadius(e.value || 1)}}/>
            </div>
          </div>
        </Card>

        <Card className="svg-card"><svg xmlns="http://www.w3.org/2000/svg" width="300px" height="300px" ref={svgElement}
          onClick={onGraphClick} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
          <polygon points="150,150 150,250 250,250 250,150" fill="rgba(0,0,100,0.1)"/>
          <polygon points="100,150 150,150 150,250" fill="rgba(0,0,100,0.1)"/>
          <path d="M150,100 A50,50 0 0 1 200,150 L150,150 Z" fill="rgba(0,0,100,0.1)"/>

          <line x1="0" x2="300" y1="150" y2="150" stroke="#666666"/>
          <line x1="150" x2="150" y1="0" y2="300" stroke="#666666"/>

          <polygon points="150,0 145,10 155,10" stroke="#666666"/>
          <polygon points="300,150 290,145 290,155" stroke="#666666"/>

          <line x1="50" x2="50" y1="145" y2="155" stroke="#666666"/>
          <line x1="100" x2="100" y1="145" y2="155" stroke="#666666"/>
          <line x1="200" x2="200" y1="145" y2="155" stroke="#666666"/>
          <line x1="250" x2="250" y1="145" y2="155" stroke="#666666"/>
          <line x1="145" x2="155" y1="50" y2="50" stroke="#666666"/>
          <line x1="145" x2="155" y1="100" y2="100" stroke="#666666"/>
          <line x1="145" x2="155" y1="200" y2="200" stroke="#666666"/>
          <line x1="145" x2="155" y1="250" y2="250" stroke="#666666"/>

          <text x="290" y="138">X</text>
          <text x="162" y="10">Y</text>

          <text x="50" y="138" textAnchor="middle">{-radius}</text>
          <text x="100" y="138" textAnchor="middle">{-radius/2}</text>
          <text x="200" y="138" textAnchor="middle">{radius/2}</text>
          <text x="250" y="138" textAnchor="middle">{radius}</text>

          <text x="162" y="50" dominantBaseline="middle">{radius}</text>
          <text x="162" y="100" dominantBaseline="middle">{radius/2}</text>
          <text x="162" y="200" dominantBaseline="middle">{-radius/2}</text>
          <text x="162" y="250" dominantBaseline="middle">{-radius}</text>

          {data.filter((point) => point.r == radius).map((point, i) => (
            <circle key={i}  r="3" fill={point.hit ? "green" : "red"}
              cx={point.x * 100 / radius + 150}
              cy={-point.y * 100 / radius + 150}/>
          ))}
          <circle r="3" stroke="black" fill="none"
            cx={phantomCoords.x * 100 / radius + 150}
            cy={-phantomCoords.y * 100 / radius + 150}/>
        </svg></Card>
      </div>
      <Card className="table-card">
        <DataTable value={data} showGridlines emptyMessage="Точек нет">
          <Column header="Время" body={(val) => 
            (new Date(val.creationTime * 1000)).toLocaleString("ru-RU")
          }/>
          <Column field="x" header="X"/>
          <Column field="y" header="Y"/>
          <Column field="r" header="R"/>
          <Column header="Статус" body={(val) =>
            val.hit ? "Попал" : "Промах"}/>
          <Column header="Затрачено" body={(val) =>
            Math.round(val.processingTime / 1e6) + " мс"}/>
        </DataTable>
      </Card>
    </div>
  );
}

export default MainPage;

