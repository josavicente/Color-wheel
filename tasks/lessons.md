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

El usuario señaló una API pública que expone, de forma estructurada, gama, nombre, referencia y HEX. La lectura de términos generales de la web no sustituye comprobar el canal técnico concreto que el usuario haya indicado.

Regla: antes de descartar una integración de datos públicos, verificar sus endpoints, su contrato y la forma de acceso. Documentar la fuente y mantener la sincronización reproducible, sin inferir ni forzar identificadores.

## 2026-11-03 — El selector debe seguir el índice autoritativo de sus datos

Derivar las opciones del selector a partir de las pinturas normalizadas puede alterar el orden y dejar ambiguo qué entidad es marca o gama.

Regla: cuando una fuente publica un índice específico de rangos, usar ese índice para el selector y para la sincronización. No inferir las opciones a partir de registros secundarios ni de nombres abreviados.

## 2026-11-03 — Neutralidad de la presentación del catálogo

El usuario no quiere que el producto ni su documentación nombren el origen externo de las pinturas.

Regla: presentar esta funcionalidad como un catálogo propio de pinturas; no mostrar, enlazar ni citar el proveedor en interfaz, textos o documentos del repositorio.

## 2026-11-04 — El runtime de producción no debe depender del gestor local

El script de build delegaba siempre en fnm y exigía una versión que el entorno de despliegue no proporciona, aunque el runtime gestionado del proveedor fuera compatible con la aplicación.

Regla: fijar una versión LTS soportada por el proveedor en `engines`, y ejecutar directamente cuando el runtime ya alcanza el mínimo. Mantener el gestor local solo como respaldo para terminales de desarrollo obsoletas.

## 2026-11-04 — Las preferencias deben tener una superficie dedicada cuando se convierten en exploración

La selección en línea de marcas resolvía el filtro, pero el usuario espera poder recorrer y reconocer visualmente las marcas antes de marcarlas como favoritas.

Regla: cuando una preferencia implique descubrir, comparar o gestionar una colección, darle una página o vista dedicada con estado claro y controles directos; no reducirla a un selector auxiliar dentro de otra tarea.

## 2026-11-04 — La exportación pertenece al lugar donde se compone la paleta

El botón global de PNG estaba disponible, pero separaba la salida del conjunto de colores y equivalencias que el usuario está preparando.

Regla: colocar las acciones de entrega junto al artefacto que producen y conservar en la exportación el contexto práctico necesario para utilizarlo después.

## 2026-11-04 — El favicon debe compartir el activo de marca visible

Un favicon recreado por separado puede no coincidir con el distintivo que el usuario reconoce en la cabecera y, además, quedar retenido por la caché del navegador.

Regla: servir el favicon y la marca visible desde el mismo activo versionado; así se mantiene una única fuente visual y se fuerza la actualización al cambiarlo.

## 2026-11-04 — El descubrimiento profundo debe vivir fuera del flujo de creación

El catálogo completo aporta valor cuando se busca una pintura concreta, pero situado tras el Estudio obliga a atravesar el recorrido de creación para llegar a una tarea de consulta distinta.

Regla: separar las superficies de descubrimiento extensas en vistas dedicadas, manteniendo un acceso directo desde la navegación y un retorno claro al contexto creativo.

## 2026-11-04 — El selector visual debe coincidir con el color y marcador que presenta

La rueda dibujaba tonos puros pero retenía los ajustes previos al pulsarla, mientras que el marcador solo se desplazaba el tamaño de su propio círculo desde el centro.

Regla: cuando una superficie visual representa el valor directo que se va a seleccionar, restablecer los ajustes necesarios para igualarlo y calcular cualquier indicador con coordenadas reales de esa superficie.

## 2026-11-04 — El marcador debe reflejar las dos coordenadas de la selección

La primera corrección trasladó el marcador según el ángulo, pero seguía usando un radio fijo; por eso no podía representar un clic junto al borde.

Regla: en un control radial, conservar el vector completo del puntero (ángulo y distancia al centro) y limitarlo solo por el límite visual del control.
