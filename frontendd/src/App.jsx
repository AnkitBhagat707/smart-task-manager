import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleSignup = async () => {
    if (!username || !password) {
      alert("Enter username & password");
      return;
    }

    const res = await fetch("http://127.0.0.1:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    alert(data.msg);
  };

  const handleLogin = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data.token) {
      setToken(data.token);
    } else {
      alert("Login failed");
    }
  };

  const createTask = async () => {
    if (!title.trim()) {
      alert("Enter a task");
      return;
    }

    const res = await fetch("http://127.0.0.1:5000/api/tasks/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });

    const data = await res.json();
    setTitle("");
    getTasks();
  };

  const getTasks = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/tasks/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setTasks(data.tasks || []);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Smart Task Manager</h1>

      {!token ? (
        <div style={styles.card}>
          <h3>Login / Signup</h3>

          <input
            style={styles.input}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.button} onClick={handleLogin}>
            Login
          </button>

          <button
            style={{ ...styles.button, backgroundColor: "#555" }}
            onClick={handleSignup}
          >
            Signup
          </button>
        </div>
      ) : (
        <div style={styles.card}>
          <h3>Create Task</h3>

          <input
            style={styles.input}
            placeholder="Enter task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div>
            <button style={styles.button} onClick={createTask}>
              Add Task
            </button>

            <button
              style={{ ...styles.button, backgroundColor: "#555" }}
              onClick={getTasks}
            >
              Show Tasks
            </button>
          </div>

          <h3 style={{ marginTop: "20px" }}>Tasks</h3>

          {tasks.length === 0 ? (
            <p style={{ color: "#888" }}>No tasks yet</p>
          ) : (
            <ul style={styles.list}>
              {tasks.map((t) => (
                <li key={t.id} style={styles.listItem}>
                  <div>
                    <strong>{t.title}</strong>
                    <p style={{ fontSize: "12px", color: "#aaa" }}>
                      {t.status} • {t.priority}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "40px",
    fontFamily: "Arial",
  },

  heading: {
    marginBottom: "20px",
  },

  card: {
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
    boxShadow: "0 0 10px rgba(0,0,0,0.5)",
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "6px",
    border: "none",
    outline: "none",
  },

  button: {
    padding: "10px",
    margin: "5px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#4CAF50",
    color: "white",
    cursor: "pointer",
  },

  list: {
    listStyle: "none",
    padding: 0,
  },

  listItem: {
    backgroundColor: "#334155",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "8px",
  },
};

export default App;