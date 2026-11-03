# ColorWheel

Proyecto de web con React y TypeScript para experimentar con una rueda de color continua, crear paletas propias y exportarlas como imágenes.

Estado: primera entrega funcional implementada.

## Ejecutar localmente

El proyecto usa Node 26.13.0. Los scripts usan esa versión mediante fnm aunque la terminal abierta conserve un Node anterior; .node-version hace que las terminales nuevas la seleccionen automáticamente.

    npm install
    npm run dev

Para comprobar y crear la compilación de producción:

    npm run check
    npm run build

La aplicación permite explorar una rueda RYB/RGB continua y una rueda ampliada de tonos y saturaciones, crear y editar paletas, guardar copias locales, recuperar acciones, exportar un PNG y reutilizar los valores como JSON o variables CSS.

- [Plan de implementación, funciones iniciales y mejoras futuras](docs/plan-implementacion.md)
- [Hitos de implementación](tasks/tasks-color-wheel.md)
- [Seguimiento de la planificación](tasks/todo.md)
