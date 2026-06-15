const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Gets HTTP headers, appending authorization JWT token if present.
 */
function getHeaders() {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('taskly_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Handles the fetch response and throws descriptive errors on non-2xx statuses.
 */
async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson && errJson.message) {
        errorMsg = errJson.message;
      } else if (errJson && errJson.error) {
        errorMsg = errJson.error;
      }
    } catch (e) {
      // Not json
    }
    throw new Error(errorMsg);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

export const api = {
  // --- Auth Options ---
  async login(email, password) {
    const data = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    }).then(handleResponse);
    
    // Structure expected: { token, user: { name, email, ... } } or similar.
    // Let's standardise the return so the Auth Context gets the token and user details.
    return data;
  },

  async register(name, email, password) {
    const data = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, email, password })
    }).then(handleResponse);

    return data;
  },

  // --- Category Options ---
  async getCategories() {
    return fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: getHeaders(),
    }).then(handleResponse);
  },

  async createCategory(categoryData) {
    // categoryData: { name, icon, color, status, description }
    return fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(categoryData)
    }).then(handleResponse);
  },

  async updateCategory(id, categoryData) {
    return fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(categoryData)
    }).then(handleResponse);
  },

  async deleteCategory(id) {
    return fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse);
  },

  // --- Todo Options ---
  async getTodos() {
    return fetch(`${API_BASE_URL}/todos`, {
      method: 'GET',
      headers: getHeaders(),
    }).then(handleResponse);
  },

  async createTodo(todoData) {
    // todoData: { title, description, priority, category, dueDate }
    return fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(todoData)
    }).then(handleResponse);
  },

  async updateTodo(id, todoData) {
    // todoData: { title, description, priority, category, dueDate, completed }
    return fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(todoData)
    }).then(handleResponse);
  },

  async deleteTodo(id) {
    return fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse);
  }
};
