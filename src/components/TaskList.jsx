import { useEffect, useState } from "react";
import { useTask } from "../hooks/useTask";
import './TaskList.css'

export const TaskList = () => {
  const { getTasks, tasks, createTask,  toggleCompleteTask, deleteTask, loading, error } = useTask();
  const [title, setTitle] = useState("");

  useEffect(() => {
    getTasks();
  }, []);

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (title && title.trim().length !== 0) {
      createTask({ title });
      setTitle("");
    }
  };

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  if (loading && tasks.length === 0) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Tareas</h1>

      <form onSubmit={handleCreateTask}>
        <input 
          type="text" 
          value={title}
          onChange={handleChange}
          placeholder="Nueva tarea..."
          data-testid="task-input"
        />
        <button type="submit" data-testid="add-task-button">
          Crear tarea
        </button>
      </form>

      <ul data-testid="task-list">
        {tasks.map((task) => (
          <li key={task.id} data-testid={`task-${task.id}`}>
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}
            </span>
            
            <button 
              onClick={() => toggleCompleteTask(task)}
              data-testid={`toggle-task-${task.id}`}
            >
              {task.completed ? 'Desmarcar' : 'Completar'}
            </button>
            
            <button 
              onClick={() => deleteTask(task.id)}
              data-testid={`delete-task-${task.id}`}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};