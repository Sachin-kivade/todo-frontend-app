import { useState, useEffect } from "react";
import { API_BASE } from "../api";
import { getAuthHeaders } from "../auth";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";


function Todo() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("low");

  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const [dark, setDark] = useState(false);

  const username = localStorage.getItem("username") || "User";

  //  Fetch Todos
  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API_BASE}/todos`, {
        headers: getAuthHeaders(),
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      }

      const data = await res.json();
      setTodos(Array.isArray(data.todos) ? data.todos : []);
    } catch (error) {
      console.log(error);
    }
  };

  //  Add Todo
  const addTodo = async () => {
    if (!title) return;

    await fetch(`${API_BASE}/todos`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json"   // 🔥 ADD THIS
      },
      body: JSON.stringify({
        title,
        date,
        priority
      }),
    });

    setTitle("");
    setDate("");
    setPriority("low");

    fetchTodos();
  };
  //  Delete
  const deleteTodo = async (id) => {
    await fetch(`${API_BASE}/todos/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    fetchTodos();
  };

  //  Toggle
  const toggleComplete = async (id, status) => {
    await fetch(`${API_BASE}/todos/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ completed: !status }),
    });

    fetchTodos();
  };

  //  Edit
  const startEdit = (todo) => {
    setEditId(todo._id);
    setEditText(todo.title);
  };
  
  const saveEdit = async (id) => {
    await fetch(`${API_BASE}/todos/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ title: editText }),
    });

    setEditId(null);
    setEditText("");
    fetchTodos();
  };

  //  Logout
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    fetchTodos();
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen 
    bg-indigo-200 via-purple-200 to-pink-200 
    dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">

      {/*  NAVBAR */}
      <Navbar
        dark={dark}
        setDark={setDark}
        handleLogout={logout}
      />

      {/*  MAIN */}
      <div className="flex justify-center items-center flex-1">

        <div className="backdrop-blur-xl bg-white/60 border border-white/30 shadow-2xl rounded-2xl p-6 w-full max-w-md">

          <h2 className="text-2xl font-bold text-center mb-4">
            ✨ Todo Dashboard
          </h2>

          {/*  STATS */}
          <div className="flex justify-between text-sm mb-4">
            <span>Total: {todos.length}</span>
            <span>Done: {todos.filter(t => t.completed).length}</span>
            <span>Pending: {todos.filter(t => !t.completed).length}</span>
          </div>

          {/*  ADD TODO */}
          <input
            type="text"
            placeholder="Enter todo..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => {
              console.log("DATE:", e.target.value); // 🔥 debug
              setDate(e.target.value);
            }}
            className="w-full mb-2 p-2 border rounded"
          />

          <select
            value={priority}
            onChange={(e) => {
              console.log("PRIORITY:", e.target.value);
              setPriority(e.target.value);
            }}
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>

          <button
            onClick={addTodo}
            className="w-full bg-blue-500 text-white py-2 rounded-lg mb-4"
          >
            Add Todo
          </button>

          {/* EMPTY */}
          {todos.length === 0 && (
            <p className="text-center text-gray-400">No tasks yet 🚀</p>
          )}

          {/*  LIST */}
          <ul className="space-y-2">
            {todos.map((todo) => (
              <motion.li
                key={todo._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between bg-white p-3 rounded-lg shadow"
              >
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo._id, todo.completed)}
                  />

                  {editId === todo._id ? (
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 border px-2 py-1 rounded"
                    />
                  ) : (
                    <div className="flex-1">
                      <p className={todo.completed ? "line-through text-gray-400" : ""}>
                        {todo.title}
                      </p>

                      <p className="text-xs text-gray-500">
                        {todo.date ? new Date(todo.date).toLocaleDateString() : "No date"}
                      </p>

                      <span
                        className={`text-xs px-2 py-1 rounded ${(todo.priority || "low") === "high"
                            ? "bg-red-200"
                            : (todo.priority || "low") === "medium"
                              ? "bg-yellow-200"
                              : "bg-green-200"
                          }`}
                      >
                        {todo.priority}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {editId === todo._id ? (
                    <button onClick={() => saveEdit(todo._id)}>💾</button>
                  ) : (
                    <button onClick={() => startEdit(todo)}>✏️</button>
                  )}

                  <button onClick={() => deleteTodo(todo._id)}>🗑</button>
                </div>
              </motion.li>
            ))}
          </ul>

        </div>
      </div>
    </div>
  );
}

export default Todo;