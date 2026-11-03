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

## 2026-11-03 — La exploración ampliada debe conservar la metáfora de rueda

La cuadrícula de tonos resolvía el acceso rápido, pero se alejaba de la rueda física que el usuario quería utilizar y hacía menos evidente la relación entre matiz, claros y oscuros.

Regla: cuando se amplíe una interacción radial, mantener los valores en anillos concéntricos del propio selector. Los controles siguen ofreciendo precisión, pero los claros, medios y profundos se seleccionan visualmente dentro de la rueda.

## 2026-11-03 — Verificar los canales de datos además de los términos de la interfaz

El usuario señaló una API pública de PaintPad que expone, de forma estructurada, gama, nombre, referencia y HEX. La lectura de términos generales de la web no sustituye comprobar el canal técnico concreto que el usuario haya indicado.

Regla: antes de descartar una integración de datos públicos, verificar sus endpoints, su contrato y la forma de acceso. Documentar la fuente y mantener la sincronización reproducible, sin inferir ni forzar identificadores.

## 2026-11-03 — El selector debe seguir el índice autoritativo de sus datos

Derivar las opciones del selector a partir de las pinturas normalizadas puede alterar el orden y dejar ambiguo qué entidad es marca o gama.

Regla: cuando una fuente publica un índice específico de rangos, usar ese índice para el selector y para la sincronización. No inferir las opciones a partir de registros secundarios ni de nombres abreviados.
