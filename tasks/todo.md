# Planificación de ColorWheel

Fecha: 3 de noviembre de 2026. Rama: `codex/plan-color-wheel`.

## Trabajo de esta sesión

- [x] Revisar el repositorio y las dos fotografías de referencia.
- [x] Crear una rama específica para el plan.
- [x] Definir el alcance inicial, las mejoras futuras y las decisiones de color.
- [x] Documentar arquitectura, fases y criterios de aceptación.
- [x] Revisar coherencia, cobertura de las fotografías y límites de la propuesta.
- [x] Preparar la entrega del plan para revisión antes de implementar.

## Seguimiento de implementación

Los hitos pendientes están en [tasks-color-wheel.md](tasks-color-wheel.md). La primera entrega funcional ya implementa el recorrido de creación y exportación; quedan funciones y verificaciones de las fases 4 a 6.

## Revisión

- Propuesta documentada en [plan-implementacion.md](../docs/plan-implementacion.md): 12 grupos de funciones iniciales, hoja de ruta futura y 6 fases con aceptación.
- Prioridad incorporada: experimentación, paletas propias y PNG desde el recorrido mínimo completo, antes de completar herramientas adicionales.
- Revisión técnica independiente del modelo de color y revisión de coherencia del documento realizadas. Ajustes resueltos: paleta vacía y contrato de enlaces compartidos.
- Verificados enlaces relativos y presencia de todos los identificadores F01–F12. Comprobación de whitespace con `git diff --check` correcta.
- README actualizado para localizar los documentos. No se han implementado funcionalidades, instalado dependencias ni ejecutado pruebas de aplicación. No se ha hecho commit ni push.
- La implementación queda pendiente de revisión del alcance, conforme a la solicitud de preparar primero el plan y a la habilidad de planificación.

## Implementación — 3 de noviembre de 2026

- Base React + TypeScript + Vite creada y anclada a Node 26.13.0 mediante el archivo .node-version.
- Entregados rueda RYB/RGB continua, controles de color, armonías básicas, mezclador, paleta local editable, bloqueos, reordenación, deshacer/rehacer y exportación PNG.
- Verificados comprobación de tipos, build de producción, la interacción de añadir muestra y la vista previa/acción de descarga PNG en el navegador.
- Pendientes para una siguiente iteración: variantes, armonías adicionales, biblioteca de paletas, JSON/CSS/enlaces, accesibilidad exhaustiva y validación móvil.

## Iteración — rueda concéntrica y mezclas múltiples

- [x] Confirmar la fuente solicitada para el catálogo: se usará un origen público con gama, nombre, referencia y HEX.
- [x] Sustituir la cuadrícula de la "Rueda ampliada" por anillos claros, base y oscuros integrados en la rueda.
- [x] Permitir varios colores de aporte y proporciones editables en el mezclador.
- [x] Mantener la exportación PNG de paletas y verificar el diálogo y la generación Canvas; el navegador automatizado no expone el evento de descarga.
- [x] Documentar la sincronización reproducible del catálogo y sus alias de rango conocidos.
- [x] Ejecutar comprobación de tipos, build y revisión de la interacción en navegador.

## Revisión — 3 de noviembre de 2026

- `npm run check`, `npm run build` y `git diff --check` superados.
- Validado en navegador: carga diferida del catálogo, búsqueda de Squid Orange, selección que conserva `#F49444`, coincidencias por similitud OKLab, mezclador con un tercer aporte y activación por teclado del anillo profundo.
- La prueba automatizada de descarga PNG no recibió un evento de descarga del navegador, pero el diálogo, la previsualización y la acción `canvas.toBlob(..., 'image/png')` permanecen activos.

## Corrección de catálogo — 3 de noviembre de 2026

- [x] Validar los 31 aliases de tres caracteres suministrados por el usuario contra la API pública.
- [x] Alimentar el selector de gamas desde el índice de `/paints/by-range` generado por la sincronización.
- [x] Regenerar documentación, comprobar build y publicar la corrección.

### Revisión

- Los 31 endpoints respondieron correctamente con pinturas.
- En navegador, el selector inicia con el mismo orden que el índice: AK Interactive, AK Interactive 3rd Generation Acrylics, AK Interactive Abteilung 502 y AK Interactive Acrylic Washes.

## Corrección de presentación — 3 de noviembre de 2026

- [x] Retirar todas las referencias al proveedor externo de interfaz, documentación, scripts y datos generados.
- [x] Renombrar los artefactos técnicos a términos neutrales de catálogo.
- [x] Comprobar con búsqueda global y navegador que no aparece ninguna referencia.

## Iteración — equivalencias de mezcla y móvil

- [x] Mostrar las cinco pinturas más cercanas bajo el resultado del mezclador, con muestra, gama, referencia y HEX.
- [x] Conservar el acceso de un toque para usar una equivalencia en la rueda.
- [x] Ajustar densidad, objetivos táctiles y disposición del mezclador/catálogo para pantallas de 375 px.
- [x] Verificar interacción de equivalencias, mezcla múltiple y vista móvil; ejecutar tipos y build.

### Revisión

- A 375 px, el mezclador presenta cinco equivalencias táctiles bajo su resultado antes de las acciones de paleta.
- Verificado que una equivalencia actualiza la rueda con su HEX exacto (`#9F9E67`).
- `npm run check`, `npm run build` y `git diff --check` superados.

## Iteración — exportación con equivalencias

- [x] Mover la acción de exportar PNG desde la cabecera al Estudio de color.
- [x] Ampliar las coincidencias de cada muestra más allá de tres y conservar su selección de marcas favoritas.
- [x] Incluir las pinturas correspondientes, marca, gama, referencia y HEX en el PNG exportado.
- [x] Verificar composición con una paleta completa, móvil, build y publicación.

### Diseño y aceptación

- El PNG debe crecer verticalmente para hacer sitio a las equivalencias sin comprimir las muestras de la paleta.
- Cada color exportado muestra hasta ocho correspondencias más cercanas; en la interfaz se muestra la misma cantidad.

### Revisión

- Verificada en navegador una paleta de tres muestras: la cabecera no ofrece exportación, el Estudio sí y cada ficha muestra ocho equivalencias.
- Confirmada la descarga de un PNG con el aviso de equivalencias y el layout sin desbordamiento horizontal a 375 px.
- `npm run check`, `npm run build` y `git diff --check` superados; comprobada también la ausencia de la referencia externa prohibida fuera de los assets.

## Iteración — página de marcas favoritas

- [x] Trasladar la selección de marcas desde el catálogo a una página dedicada accesible desde la cabecera.
- [x] Mostrar todas las marcas como tarjetas con estrella de favorito y fondo editorial; conservar su preferencia local existente.
- [x] Incorporar identificadores visuales locales por marca y evitar dependencias remotas frágiles.
- [x] Verificar selección, persistencia, sugerencias filtradas, móvil y compilación; documentar y publicar.

### Diseño y aceptación

- La página debe permitir ver y alternar cualquier marca en un toque, y comunicar cuántas están activas.
- La biblioteca conserva el catálogo manual; la cabecera ofrece acceso directo a la nueva página de preferencias.
- Las marcas favoritas ya guardadas se mantienen y continúan filtrando todas las equivalencias.

### Revisión

- La ruta `#marcas` muestra 29 tarjetas de marca con monograma de fondo y estrella accesible (`aria-pressed`); no se descargan ni enlazan logotipos de terceros.
- Validado en navegador: navegación desde cabecera, las 29 tarjetas y cabecera de estado. A 375 px CSS la cuadrícula pasa a una columna.
- `npm run check`, `npm run build` y `git diff --check` superados.

## Corrección de despliegue — 4 de noviembre de 2026

- [x] Identificar que el fallo procede de la dependencia de fnm en el build remoto.
- [x] Fijar una versión LTS admitida por Vercel y ejecutar el runtime remoto directamente.
- [x] Verificar el build y publicar la corrección.

### Revisión

- `npm run check` y `npm run build` superados desde la terminal heredada.
- Verificada además la rama directa del wrapper con un runtime moderno y su `PATH` de Node, que es la ruta utilizada en el build remoto.

## Iteración — tipo de pintura

- [x] Mostrar el tipo de cada pintura como etiqueta independiente de su referencia.
- [x] Mantener la lectura compacta de nombre, gama, código, HEX y tipo en móvil.
- [x] Verificar búsqueda por tipo, tipos y build.

### Revisión

- Cada ficha presenta el tipo suministrado por su gama (por ejemplo, Base, Shade, Contrast o Metallic) en una etiqueta separada de la referencia.
- Validado en navegador: la búsqueda `Shade` devuelve 233 pinturas y conserva el tipo individual en cada resultado.
- `npm run check`, `npm run build` y `git diff --check` superados.

## Iteración — marcas favoritas y equivalencias de paleta

- [x] Persistir las marcas favoritas en el espacio de trabajo local, con selección y retirada accesibles.
- [x] Limitar las sugerencias de pintura del color activo, del mezclador y de cada muestra de la paleta a las marcas favoritas cuando existan.
- [x] Añadir equivalencias compactas bajo cada color del Estudio de color, manteniendo la cuadrícula legible en móvil.
- [x] Actualizar documentación de producto, comprobar tipos, build, comportamiento persistente y disposición móvil.

### Diseño y aceptación

- Sin marcas elegidas, las sugerencias usan todo el catálogo; al elegir una o más, no aparece ninguna sugerencia de una marca distinta.
- El catálogo sigue siendo explorable completo: las preferencias afectan a recomendaciones, no al descubrimiento manual.
- Cada muestra de la paleta muestra hasta tres equivalencias y permite tocar una para llevar ese HEX a la rueda.

### Revisión

- El selector presenta 29 marcas agrupadas; las preferencias se guardan junto con la paleta en el navegador y se pueden retirar individualmente o limpiar por completo.
- Sin preferencias, el catálogo completo continúa alimentando todas las sugerencias. La lista manual del catálogo nunca queda filtrada por las marcas favoritas.
- Validado en navegador: cuatro muestras renderizan tres equivalencias cada una; a 375 px, el selector de marcas pasa a una sola columna y las cuatro listas compactas siguen presentes.
- `npm run check`, `npm run build` y `git diff --check` superados.
