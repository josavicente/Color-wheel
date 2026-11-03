# Lecciones y preferencias del proyecto

## 2026-11-03 — Prioridad de utilidad y experiencia

El usuario ha destacado que experimentar, crear paletas propias y exportarlas como imagen es esencial.

Regla: diseñar y validar primero el recorrido completo desde la selección de un color hasta la descarga PNG. Mantener el editor de paleta accesible mientras se explora la rueda; no relegar la exportación de imagen a una mejora futura ni subordinar el flujo a contenidos de teoría de color.

## 2026-11-03 — Node de la terminal existente

La actualización de Node mediante fnm no cambia el proceso de una terminal ya abierta, que puede seguir resolviendo Node 18 y fallar al ejecutar Vite actual.

Regla: cuando las herramientas de proyecto requieran una versión concreta de Node, los scripts npm deben seleccionar explícitamente la versión gestionada o fallar con una indicación concreta. No depender solo de la inicialización de la shell o de una terminal abierta recientemente.

## 2026-11-03 — Tono profundo sin ensayo manual

El control preciso de luz y croma no basta para explorar: obliga a anticipar visualmente el resultado y hace lentas tareas simples, como encontrar un verde oscuro.

Regla: para una edición continua importante, ofrecer una exploración visual directa además de controles numéricos. En la rueda, mantener el matiz elegido y mostrar una cuadrícula de tonos y saturaciones seleccionables de un clic.
