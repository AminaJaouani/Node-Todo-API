// ===== STATE =====
let authToken = localStorage.getItem('authToken') || null;
let currentUserEmail = localStorage.getItem('userEmail') || null;

// ===== ELEMENTS =====
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');

const registerForm = document.getElementById('register-form');
const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');
const registerMessage = document.getElementById('register-message');

const loginForm = document.getElementById('login-form');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginMessage = document.getElementById('login-message');

const userEmailSpan = document.getElementById('user-email');
const logoutBtn = document.getElementById('logout-btn');

const todoForm = document.getElementById('todo-form');
const todoTextInput = document.getElementById('todo-text');
const todoMessage = document.getElementById('todo-message');
const todoList = document.getElementById('todo-list');

// ===== HELPERS =====
function setAuth(token, email) {
  authToken = token;
  currentUserEmail = email;
  if (token) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', email);
  } else {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
  }
  updateUI();
}

function updateUI() {
  if (authToken) {
    authSection.classList.add('hidden');
    appSection.classList.remove('hidden');
    userEmailSpan.textContent = currentUserEmail || '';
    fetchTodos();
  } else {
    authSection.classList.remove('hidden');
    appSection.classList.add('hidden');
    loginMessage.textContent = '';
    registerMessage.textContent = '';
    todoList.innerHTML = '';
    todoTextInput.value = '';
  }
}

async function apiFetch(path, options = {}) {
  const opts = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  };

  if (authToken) {
    opts.headers['x-auth'] = authToken;
  }

  const res = await fetch(path, opts);
  if (!res.ok) {
    // try to read error if any
    let text = '';
    try {
      text = await res.text();
    } catch (_) {}
    const error = new Error(text || `Request failed with status ${res.status}`);
    error.status = res.status;
    throw error;
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ===== AUTH: REGISTER =====
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  registerMessage.textContent = '';
  registerMessage.classList.remove('error');

  try {
    const res = await fetch('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: registerEmail.value.trim(),
        password: registerPassword.value.trim()
      })
    });

    if (!res.ok) {
      registerMessage.textContent = 'Unable to register. Email may already be used or invalid.';
      registerMessage.classList.add('error');
      return;
    }

    const user = await res.json();
    const token = res.headers.get('x-auth');

    setAuth(token, user.email);
    registerEmail.value = '';
    registerPassword.value = '';
  } catch (err) {
    registerMessage.textContent = 'Error while registering.';
    registerMessage.classList.add('error');
    console.error(err);
  }
});

// ===== AUTH: LOGIN =====
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginMessage.textContent = '';
  loginMessage.classList.remove('error');

  try {
    const res = await fetch('/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: loginEmail.value.trim(),
        password: loginPassword.value.trim()
      })
    });

    if (!res.ok) {
      loginMessage.textContent = 'Invalid email or password.';
      loginMessage.classList.add('error');
      return;
    }

    const user = await res.json();
    const token = res.headers.get('x-auth');
    setAuth(token, user.email);

    loginEmail.value = '';
    loginPassword.value = '';
  } catch (err) {
    loginMessage.textContent = 'Error while logging in.';
    loginMessage.classList.add('error');
    console.error(err);
  }
});

// ===== LOGOUT =====
logoutBtn.addEventListener('click', async () => {
  if (!authToken) {
    setAuth(null, null);
    return;
  }

  try {
    await fetch('/users/me/token', {
      method: 'DELETE',
      headers: {
        'x-auth': authToken
      }
    });
  } catch (err) {
    console.warn('Logout request failed (might be already invalid token).', err);
  } finally {
    setAuth(null, null);
  }
});

// ===== TODOS: FETCH LIST =====
async function fetchTodos() {
  if (!authToken) return;

  try {
    const data = await apiFetch('/todos');
    renderTodos(data.todos || []);
  } catch (err) {
    console.error(err);
    todoMessage.textContent = 'Failed to load todos.';
    todoMessage.classList.add('error');
  }
}

function renderTodos(todos) {
  todoList.innerHTML = '';

  if (!todos.length) {
    todoList.innerHTML = '<li class="todo-item">No todos yet. Add one above 👆</li>';
    return;
  }

  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = 'todo-item';

    const left = document.createElement('div');
    left.className = 'todo-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!todo.completed;

    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text;
    if (todo.completed) {
      textSpan.classList.add('completed');
    }

    checkbox.addEventListener('change', () => {
      updateTodo(todo._id, {
        text: todo.text,
        completed: checkbox.checked
      });
    });

    left.appendChild(checkbox);
    left.appendChild(textSpan);

    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'danger';
    delBtn.addEventListener('click', () => {
      deleteTodo(todo._id);
    });

    actions.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(actions);
    todoList.appendChild(li);
  });
}

// ===== TODOS: ADD =====
todoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  todoMessage.textContent = '';
  todoMessage.classList.remove('error');

  const text = todoTextInput.value.trim();
  if (!text) return;

  try {
    const data = await apiFetch('/todos', {
      method: 'POST',
      body: JSON.stringify({ text })
    });

    todoTextInput.value = '';
    // Reload list
    fetchTodos();
  } catch (err) {
    console.error(err);
    todoMessage.textContent = 'Failed to add todo.';
    todoMessage.classList.add('error');
  }
});

// ===== TODOS: UPDATE =====
async function updateTodo(id, body) {
  try {
    await apiFetch(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });
    fetchTodos();
  } catch (err) {
    console.error(err);
    todoMessage.textContent = 'Failed to update todo.';
    todoMessage.classList.add('error');
  }
}

// ===== TODOS: DELETE =====
async function deleteTodo(id) {
  try {
    await apiFetch(`/todos/${id}`, {
      method: 'DELETE'
    });
    fetchTodos();
  } catch (err) {
    console.error(err);
    todoMessage.textContent = 'Failed to delete todo.';
    todoMessage.classList.add('error');
  }
}

// ===== INIT =====
updateUI();
