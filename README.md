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

La aplicación permite explorar una rueda RYB/RGB continua y una rueda ampliada con anillos claros, medios y profundos; crear y editar paletas; combinar hasta seis colores con proporciones y ver sus equivalencias de pintura; guardar copias locales; recuperar acciones; exportar un PNG y reutilizar los valores como JSON o variables CSS. La interfaz se adapta a móvil con controles táctiles y una sola columna para el catálogo.

Incluye una biblioteca local de 7.376 pinturas de 62 gamas, con búsqueda por nombre, referencia o HEX, y muestra las cinco coincidencias más cercanas al color actual. El selector de gamas mantiene su orden de sincronización. Al seleccionar una pintura, su HEX se conserva exactamente en modo RGB.

Para refrescar el catálogo desde un origen compatible:

    npm run sync:catalog -- <origen-del-catalogo>

- [Plan de implementación, funciones iniciales y mejoras futuras](docs/plan-implementacion.md)
- [Hitos de implementación](tasks/tasks-color-wheel.md)
- [Seguimiento de la planificación](tasks/todo.md)
- [Guía del catálogo de pinturas](docs/catalogo-pinturas.md)
