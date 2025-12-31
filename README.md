# Pruebas a componentes y Hooks usando Jest y React Testing Library

## Descripcion

Este proyecto aborda el testing de componentes y hooks y usando estrategias modernas para lidiar con el renderizado de componentes, simulacion de llamadas a la api y interacciones del usuario con un porcentaje de cobertura del 80%.

## Stack

- **React 19** 
- **Vite** 
- **Axios** 
- **Jest** 
- **React Testing Library** 
- **@testing-library/user-event**  
- **JSON Server** - API REST falsa para desarrollo


## Instalación
```bash
# Clonar el repositorio
git clone https://github.com/JPMB91/TalentOps-testing-con-jest-react-testing-library.git

# Instalar dependencias
npm install
```

## Scripts


- Para iniciar proyecto React
```
npm start
```

- Para ejecutar tests directamente

```bash
# Ejecutar tests
npm test

# Tests con reporte de cobertura
npm run test:coverage
```

## API Endpoints (JSON Server)

El servidor JSON Server corre en `http://localhost:3001`

- `GET /tasks` - Obtener todas las tareas
- `POST /tasks` - Crear nueva tarea
- `PUT /tasks/:id` - Actualizar tarea
- `DELETE /tasks/:id` - Eliminar tarea



