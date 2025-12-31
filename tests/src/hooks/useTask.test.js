import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { useTask } from '../../../src/hooks/useTask';
import axios from 'axios';

jest.mock('axios');

describe('useTask Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe inicializar con estado vacío', () => {
    const { result } = renderHook(() => useTask());
    
    expect(result.current.tasks).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test('getTasks debe cargar las tareas correctamente', async () => {
    const mockTasks = [
      { id: 1, title: 'Tarea 1', completed: false },
      { id: 2, title: 'Tarea 2', completed: true }
    ];
    
    axios.get = jest.fn().mockResolvedValue({ data: mockTasks });

    const { result } = renderHook(() => useTask());

    await act(async () => {
      await result.current.getTasks();
    });

    expect(result.current.tasks).toEqual(mockTasks);
    expect(result.current.loading).toBe(false);
  });

  test('createTask debe agregar una nueva tarea', async () => {
    const newTask = { id: 1, title: 'Nueva tarea', completed: false };
    axios.post = jest.fn().mockResolvedValue({ data: newTask });

    const { result } = renderHook(() => useTask());

    await act(async () => {
      await result.current.createTask({ title: 'Nueva tarea' });
    });

    await waitFor(() => {
      expect(result.current.tasks).toContainEqual(newTask);
    });
  });

  test('createTask no debe hacer nada si title está vacío', async () => {
    axios.post = jest.fn();
    
    const { result } = renderHook(() => useTask());

    await act(async () => {
      await result.current.createTask({ title: '' });
    });

    expect(axios.post).not.toHaveBeenCalled();
  });

  test('toggleCompleteTask debe cambiar el estado de completado', async () => {
    const task = { id: 1, title: 'Tarea 1', completed: false };
    const updatedTask = { ...task, completed: true };
    
    axios.put = jest.fn().mockResolvedValue({ data: updatedTask });

    const { result } = renderHook(() => useTask());


    result.current.tasks = [task];

    await act(async () => {
      await result.current.toggleCompleteTask(task);
    });

    expect(axios.put).toHaveBeenCalledWith(
      `http://localhost:3001/tasks/${task.id}`,
      { ...task, completed: true }
    );
  });

  test('deleteTask debe eliminar una tarea', async () => {
    axios.delete = jest.fn().mockResolvedValue({});

    const { result } = renderHook(() => useTask());

    // cargar tareas primero
    axios.get = jest.fn().mockResolvedValue({ 
      data: [
        { id: 1, title: 'Tarea 1', completed: false },
        { id: 2, title: 'Tarea 2', completed: false }
      ]
    });

    await act(async () => {
      await result.current.getTasks();
    });

    await act(async () => {
      await result.current.deleteTask(1);
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].id).toBe(2);
  });
});