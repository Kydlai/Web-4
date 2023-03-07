import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Card } from "primereact/card";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import * as api from "./api";
import { setCredentials } from "./store"

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toast = useRef(null);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  function validate() {
    if (login.length < 1) {
      toast.current.show({ severity: "error", summary: "Логин не может быть пустым" });
      return false;
    }

    if (password.length < 1) {
      toast.current.show({ severity: "error", summary: "Пароль не может быть пустым" });
      return false;
    }
    
    return true;
  }

  async function register() {
    if (!validate()) return;
    let res = await api.register(login, password);
    if (res.ok) {
      dispatch(setCredentials({ login, password }));
      navigate("/main");
    } if (res.status == 409) {
      toast.current.show({ severity: "error", summary: "Логин занят", detail: "Попробуйте другой логин, например: " + login + "_" });
    } else {
      toast.current.show({ severity: "error", summary: "Ошибка", detail: "Неизвестная ошибка" });
    }
  }

  async function doLogin() {
    if (!validate()) return;
    dispatch(setCredentials({ login, password }));
    let res = await api.login(login, password);
    if (res.ok) {
      navigate("/main");
    } if (res.status == 401) {
      toast.current.show({ severity: "error", summary: "Ошибка входа", detail: "Неправильный логин или пароль" });
    } else {
      toast.current.show({ severity: "error", summary: "Ошибка", detail: "Неизвестная ошибка" });
    }
  }

  let footer = <div className="flex flex-row gap-2 justify-content-end">
    <Button label="Регистрация" outlined onClick={register}/>
    <Button label="Вход" onClick={doLogin}/>
  </div>

  return (
    <div className="app-container login-page">
      <Toast ref={toast}/>
      <div className="flex flex-row justify-content-between">
        <div>Кудлай Никита Романович, P32141</div>
        <div>работа №4, вариант 14667</div>
      </div>
      <Card title="Авторизация" footer={footer} className="auth-card">
        <div className="flex flex-column gap-4">
          <div className="flex flex-column gap-2">
            <label htmlFor="login">Логин</label>
            <InputText id="login" placeholder="Логин" value={login} onChange={(e) => setLogin(e.target.value)}/>
          </div>
          <div className="flex flex-column gap-2">
            <label htmlFor="password">Пароль</label>
            <InputText id="password" placeholder="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;
