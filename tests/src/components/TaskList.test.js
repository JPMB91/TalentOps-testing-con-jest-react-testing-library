const { render, screen, waitFor } = require("@testing-library/react");
const userEvent = require("@testing-library/user-event").default;
const { TaskList } = require("../../../src/components/TaskList");
const { useTask } = require("../../../src/hooks/useTask");

jest.mock("../../../src/hooks/useTask");

describe("TaskList Component", () => {
  const mockGetTasks = jest.fn();
  const mockCreateTask = jest.fn();
  const mockToggleCompleteTask = jest.fn();
  const mockDeleteTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useTask.mockReturnValue({
      tasks: [],
      getTasks: mockGetTasks,
      createTask: mockCreateTask,
      toggleCompleteTask: mockToggleCompleteTask,
      deleteTask: mockDeleteTask,
      loading: false,
      error: null,
    });
  });

  test("debe renderizar el componente", () => {
    render(<TaskList />);

    expect(screen.getByText("Tareas")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nueva tarea...")).toBeInTheDocument();
    expect(screen.getByTestId("add-task-button")).toBeInTheDocument();
  });

  test("debe llamar getTasks al montar el componente", () => {
    render(<TaskList />);

    expect(mockGetTasks).toHaveBeenCalledTimes(1);
  });

  test("debe mostrar estado de carga", () => {
    useTask.mockReturnValue({
      tasks: [],
      getTasks: mockGetTasks,
      createTask: mockCreateTask,
      toggleCompleteTask: mockToggleCompleteTask,
      deleteTask: mockDeleteTask,
      loading: true,
      error: null,
    });

    render(<TaskList />);

    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });

  test("debe renderizar lista de tareas", () => {
    const mockTasks = [
      { id: 1, title: "Tarea 1", completed: false },
      { id: 2, title: "Tarea 2", completed: true },
    ];

    useTask.mockReturnValue({
      tasks: mockTasks,
      getTasks: mockGetTasks,
      createTask: mockCreateTask,
      toggleCompleteTask: mockToggleCompleteTask,
      deleteTask: mockDeleteTask,
      loading: false,
      error: null,
    });

    render(<TaskList />);

    expect(screen.getByText("Tarea 1")).toBeInTheDocument();
    expect(screen.getByText("Tarea 2")).toBeInTheDocument();
  });

  test("debe crear una nueva tarea usando userEvent", async () => {
    const user = userEvent.setup();
    render(<TaskList />);

    const input = screen.getByTestId("task-input");
    const button = screen.getByTestId("add-task-button");

    await user.type(input, "Nueva tarea desde userEvent");
    await user.click(button);

    expect(mockCreateTask).toHaveBeenCalledWith({
      title: "Nueva tarea desde userEvent",
    });
  });

  test("debe limpiar el input después de crear tarea", async () => {
    const user = userEvent.setup();
    render(<TaskList />);

    const input = screen.getByTestId("task-input");

    await user.type(input, "Tarea temporal");
    await user.click(screen.getByTestId("add-task-button"));

    expect(input.value).toBe("");
  });

  test("no debe crear tarea con titulo vacio", async () => {
    const user = userEvent.setup();
    render(<TaskList />);

    const button = screen.getByTestId("add-task-button");
    await user.click(button);

    expect(mockCreateTask).not.toHaveBeenCalled();
  });

  test("debe poder hacer toggle a completar una tarea", async () => {
    const user = userEvent.setup();
    const mockTasks = [{ id: 1, title: "Tarea 1", completed: false }];

    useTask.mockReturnValue({
      tasks: mockTasks,
      getTasks: mockGetTasks,
      createTask: mockCreateTask,
      toggleCompleteTask: mockToggleCompleteTask,
      deleteTask: mockDeleteTask,
      loading: false,
      error: null,
    });

    render(<TaskList />);

    const toggleButton = screen.getByTestId("toggle-task-1");
    await user.click(toggleButton);

    expect(mockToggleCompleteTask).toHaveBeenCalledWith(mockTasks[0]);
  });

  test("debe mostrar botón correcto segun estado de completado de una tarea", () => {
    const mockTasks = [
      { id: 1, title: "Tarea 1", completed: false },
      { id: 2, title: "Tarea 2", completed: true },
    ];

    useTask.mockReturnValue({
      tasks: mockTasks,
      getTasks: mockGetTasks,
      createTask: mockCreateTask,
      toggleCompleteTask: mockToggleCompleteTask,
      deleteTask: mockDeleteTask,
      loading: false,
      error: null,
    });

    render(<TaskList />);

    expect(screen.getByText("Completar")).toBeInTheDocument();
    expect(screen.getByText("Desmarcar")).toBeInTheDocument();
  });

  test("debe eliminar una tarea usando userEvent", async () => {
    const user = userEvent.setup();
    const mockTasks = [{ id: 1, title: "Tarea 1", completed: false }];

    useTask.mockReturnValue({
      tasks: mockTasks,
      getTasks: mockGetTasks,
      createTask: mockCreateTask,
      toggleCompleteTask: mockToggleCompleteTask,
      deleteTask: mockDeleteTask,
      loading: false,
      error: null,
    });

    render(<TaskList />);

    const deleteButton = screen.getByTestId("delete-task-1");
    await user.click(deleteButton);

    expect(mockDeleteTask).toHaveBeenCalledWith(1);
  });
});
