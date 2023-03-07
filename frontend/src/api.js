import store from "./store";

const BASE = "/api";

function getAuthHeaders() {
  const { login, password } = store.getState().credentials;
  return { "Authorization": "Basic " + btoa(login + ":" + password).replaceAll("=", "") }
}

export async function login() {
  return await fetch(BASE + "/user/login", {
    method: "POST",
    headers: getAuthHeaders()
  });
}

export async function register(login, password) {
  return await fetch(BASE + "/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({ login, password })
  });
}

export async function addPoint(x, y, r) {
  let res = await fetch(BASE + "/points", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...getAuthHeaders()
    },
    body: new URLSearchParams({ x, y, r })
  });
  return await res.json();
}

export async function deletePoints() {
  return await fetch(BASE + "/points", {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}

export async function getPoints() {
  let res = await fetch(BASE + "/points", {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw res.status;
  return await res.json();
}
