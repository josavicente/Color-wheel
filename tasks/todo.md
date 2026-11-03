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

- [x] Confirmar la fuente solicitada para el catálogo: se usará la API pública de PaintPad indicada por el usuario, que ofrece pinturas, marca/rango, códigos de fabricante y HEX.
- [x] Sustituir la cuadrícula de la "Rueda ampliada" por anillos claros, base y oscuros integrados en la rueda.
- [x] Permitir varios colores de aporte y proporciones editables en el mezclador.
- [x] Mantener la exportación PNG de paletas y verificar el diálogo y la generación Canvas; el navegador automatizado no expone el evento de descarga.
- [x] Documentar las llamadas reproducibles a la API pública PaintPad y sus alias de rango conocidos.
- [x] Ejecutar comprobación de tipos, build y revisión de la interacción en navegador.

## Revisión — 3 de noviembre de 2026

- `npm run check`, `npm run build` y `git diff --check` superados.
- Validado en navegador: carga diferida del catálogo, búsqueda de Squid Orange, selección que conserva `#F49444`, coincidencias por similitud OKLab, mezclador con un tercer aporte y activación por teclado del anillo profundo.
- La prueba automatizada de descarga PNG no recibió un evento de descarga del navegador, pero el diálogo, la previsualización y la acción `canvas.toBlob(..., 'image/png')` permanecen activos.
