const BASE_URL = (import.meta?.env?.VITE_API_URL || "http://localhost:3000") + "/api";

// Função para obter o token do localStorage
function getToken() {
  return localStorage.getItem("authToken");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  
  // Adiciona o token no header Authorization se existir
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...options,
  });
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      message = data?.error || message;
    } catch (_) {}
    throw new Error(message);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Users
export const UsersAPI = {
  list: () => request("/users"),
  get: (id) => request(`/users/${id}`),
  create: (payload) => request("/users", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/users/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/users/${id}`, { method: "DELETE" }),
};

// Items
export const ItemsAPI = {
  list: () => request("/items"),
  get: (id) => request(`/items/${id}`),
  create: (payload) => request("/items", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/items/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/items/${id}`, { method: "DELETE" }),
};

// Backward-compat temporary alias
export const ProductsAPI = ItemsAPI;

// Auth
export const AuthAPI = {
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  getLoggedUser: () => request("/auth/loggedUser"),
};

export default { UsersAPI, ItemsAPI, AuthAPI };
