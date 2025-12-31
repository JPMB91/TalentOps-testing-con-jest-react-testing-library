import axios from "axios";
import { useState } from "react";
const API_BASE_URL = "http://localhost:3001/tasks";

export function useTask() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const createTask = async (task) => {
    if (!task.title) return;

    try {
      const title = task.title.trim();
      const { data } = await axios.post(API_BASE_URL, {
        title,
        completed: false,
      });
      setTasks((prev) => [...prev, data]);
    } catch (err) {
      setError(err.message);
    }
  };

  const getTasks = async () => {
    try {
      setLoading(true);
      setLoading(true);
      const { data } = await axios.get(API_BASE_URL);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompleteTask = async (task) => {
    try {
      const { data } = await axios.put(`${API_BASE_URL}/${task.id}`, {
        ...task,
        completed: !task.completed,
      });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? data : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    getTasks,
    tasks,
    toggleCompleteTask,
    deleteTask,
    createTask,
    loading,
    error,
  };
}
