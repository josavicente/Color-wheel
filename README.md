# ColorWheel

Proyecto de web con React y TypeScript para experimentar con una rueda de color continua, crear paletas propias y exportarlas como imágenes.

Estado: primera entrega funcional implementada.

## Ejecutar localmente

El despliegue usa Node 24.x, versión LTS disponible en Vercel. Los scripts locales aceptan Node 24 o superior; desde una terminal antigua usan la versión gestionada con fnm para evitar incompatibilidades.

    npm install
    npm run dev

Para comprobar y crear la compilación de producción:

    npm run check
    npm run build

## SEO de producción

La página pública se optimiza para la intención “rueda de color y paletas para miniaturas”. Incluye metadatos indexables, datos estructurados de aplicación web y un canonical que ignora los hashes de interfaz.

Configura la URL pública definitiva en el entorno de despliegue antes de compilar. El build generará entonces `robots.txt` y un sitemap con esa URL; no se crea ningún sitemap si falta el dominio, para no publicar enlaces de ejemplo ni de previsualización.

    SITE_URL=https://tu-dominio.example

La aplicación permite explorar una rueda RYB/RGB continua y una rueda ampliada con anillos claros, medios y profundos; extraer localmente de 4 a 12 colores predominantes desde una fotografía; crear y editar paletas; combinar hasta seis colores con proporciones y ver sus equivalencias de pintura; guardar copias locales; recuperar acciones; exportar desde el Estudio de color un PNG con hasta ocho equivalencias por muestra (nombre, marca, gama, referencia o tipo y HEX); y reutilizar los valores como JSON o variables CSS. La interfaz se adapta a móvil con controles táctiles y una sola columna para el catálogo.

Incluye una biblioteca local de 7.376 pinturas de 62 gamas, con búsqueda por nombre, referencia, tipo o HEX. Cada ficha identifica su tipo de pintura (por ejemplo, Shade, Contrast, Base o Metallic) y muestra sus equivalencias más cercanas. Una página dedicada de marcas permite guardar favoritas en el navegador para limitar todas las recomendaciones —incluidas las del mezclador y cada muestra del Estudio de color— a esas marcas. El selector de gamas mantiene su orden de sincronización. Al seleccionar una pintura, su HEX se conserva exactamente en modo RGB.

Para refrescar el catálogo desde un origen compatible:

    npm run sync:catalog -- <origen-del-catalogo>

- [Plan de implementación, funciones iniciales y mejoras futuras](docs/plan-implementacion.md)
- [Hitos de implementación](tasks/tasks-color-wheel.md)
- [Seguimiento de la planificación](tasks/todo.md)
- [Guía del catálogo de pinturas](docs/catalogo-pinturas.md)
