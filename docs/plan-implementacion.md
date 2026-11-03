# ColorWheel: plan de producto e implementación

Fecha: 3 de noviembre de 2026. Estado: propuesta para revisión; aplicación pendiente de implementar.

## 1. Objetivo y prioridad

Crear una web con React y TypeScript que permita experimentar con una rueda de color continua, construir paletas propias y exportarlas como imágenes listas para utilizar o compartir.

La prioridad es la utilidad y la experiencia de creación: **explorar → añadir colores → ajustar la paleta → previsualizar → descargar una imagen**. Las armonías y la teoría de color ayudan a ese recorrido. La exportación de imagen forma parte del núcleo de la primera versión.

El repositorio contiene únicamente un README inicial. La propuesta parte de cero, con una aplicación que funciona en el navegador, sin cuenta ni servidor en la primera versión.

## 2. Qué aportan las fotografías

Las fotografías se utilizan como referencia visual y funcional. Los textos impresos describen el objeto; no se interpretan como instrucciones del proyecto. No se extraerán colores de sus píxeles como referencias exactas: iluminación, cámara y papel alteran su apariencia.

| Referencia | Función que conservamos | Ampliación digital |
| --- | --- | --- |
| Cara de relaciones cromáticas | Complementarios, tríadas, complementarios divididos, tétradas; variaciones claras, apagadas y oscuras | Ángulos editables, selección continua y envío directo a una paleta |
| Cara de mezclas | Añadir blanco, negro, amarillo, rojo o azul; escala de grises | Mezcla de cualquier pareja de colores, proporciones continuas y comparación del resultado |
| Ambas caras | Rueda artística de 12 familias, nombres y referencia cálido/frío | Rueda continua por defecto y vista didáctica con 12, 24 o 48 sectores |

No se reproducirá la densidad de texto del cartón. La ayuda será contextual y opcional; cambiar de herramienta conservará el trabajo.

## 3. Experiencia principal

### Primer uso

Al entrar, el usuario ve la rueda y una paleta de ejemplo editable. Puede pulsar un punto de la rueda, observar el color y añadirlo inmediatamente. Acciones principales: «Añadir a la paleta» y «Exportar imagen». El ejemplo puede vaciarse o restablecerse con deshacer disponible.

### Espacio de trabajo

- **Escritorio:** rueda grande a la izquierda, inspector del color a la derecha y paleta de trabajo visible debajo. Las herramientas «Explorar», «Armonías» y «Mezclar» comparten esa paleta.
- **Móvil:** rueda y controles en una columna, con resumen de la paleta y acciones principales accesibles. El desplazamiento de la página debe convivir con el arrastre de la rueda.
- Superficies neutras para juzgar el color; fondo de comparación claro, medio u oscuro. Tema claro/oscuro de la interfaz independiente del fondo exportado.
- Controles esenciales visibles; opciones técnicas ampliables. Etiquetas en español y vocabulario coherente.
- Seleccionar una muestra de la paleta abre su edición. Seleccionar un color en la rueda no sobrescribe una muestra hasta usar «Aplicar al color seleccionado».
- Muestras de armonía o mezcla permiten «Añadir» y «Sustituir seleccionado». Se puede añadir una armonía completa, respetando los colores bloqueados y el límite de la paleta.
- Feedback inmediato al añadir, copiar, guardar o descargar. Errores junto al control afectado y una vía clara de recuperación.

### Ejemplo del recorrido que debe funcionar

Elegir un azul intermedio → probar su complementario → añadir ambos → crear dos variantes claras → ajustar una de ellas manualmente → reordenar las cuatro muestras → comparar sobre fondo oscuro → exportar un PNG con nombre y códigos HEX.

## 4. Catálogo completo de funciones iniciales: versión 1.0

| ID | Función | Comportamiento previsto |
| --- | --- | --- |
| F01 | Rueda continua | Clic, arrastre, interacción táctil y entrada numérica; cualquier matiz intermedio, sin limitar la selección a los sectores visibles. Marcador preciso y ajuste fino de 0,1° mediante control numérico. |
| F02 | Controles de color | Editar luminosidad, croma y matiz en OKLCH; introducir HEX, RGB o HSL y consultar las cuatro representaciones. Validación sin perder el último color válido. |
| F03 | Ruedas artística y digital | Modo RYB artístico por defecto, cercano a la referencia, y alternativa RGB/HSL. Nombres de familias y guías opcionales. Cambiar de modelo conserva los colores de la paleta. |
| F04 | Armonías editables | Monocromática, análoga, complementaria, complementaria dividida, triádica, rectangular y cuadrada. Líneas y puntos sobre la rueda, separación angular ajustable cuando corresponda y muestras editables al incorporarlas a la paleta. |
| F05 | Variaciones | Escalas de 3, 5, 7 o 9 muestras hacia blanco, negro o gris; ajuste perceptivo de luminosidad/croma como herramienta diferenciada. Añadir cualquier variante a la paleta. |
| F06 | Mezclador digital | Dos colores arbitrarios, proporción 0–100 %, atajos blanco/negro/gris y primarios, comparación de origen y resultado. Métodos separados: mezcla en RGB lineal e interpolación perceptiva en Oklab; explicación breve de su diferencia. |
| F07 | Editor de paletas propias | De 0 a 12 muestras; añadir, seleccionar, editar, duplicar, eliminar y reordenar. Bloquear colores, nombrar la paleta, comparar fondos y generar propuestas desde una armonía conservando los bloqueos. |
| F08 | Experimentación reversible | Deshacer/rehacer ediciones, cambios de orden, borrados y generación. Un arrastre cuenta como una acción al terminar. Restablecer con recuperación mediante deshacer. |
| F09 | Guardado local | Borrador automático al terminar cada interacción, biblioteca de paletas con guardar/renombrar/duplicar/eliminar y recuperación al recargar. Si el almacenamiento está bloqueado o lleno, seguir trabajando y ofrecer exportación. |
| F10 | Exportación como imagen | Previsualización y descarga PNG con todas las muestras en orden, tamaños homogéneos, título y etiquetas HEX opcionales, fondos claro/oscuro/transparente y resolución 1× o 2×. Diseños tira horizontal y tarjeta con proporciones 1:1, 4:3 y 16:9. |
| F11 | Reutilización | Copiar un color o la lista de HEX; exportar variables CSS; exportar/importar JSON versionado para seguir editando. Compartir un enlace con el estado de la paleta y del modelo, sin necesitar servidor. |
| F12 | Ayuda y accesibilidad | Definiciones breves, controles por teclado, foco visible, alternativas al arrastre, etiquetas accesibles y movimiento reducido. Comparador de contraste entre dos muestras opacas con ratio y referencia AA/AAA para texto normal/grande. |

### Comportamiento del editor de paletas

- La paleta es independiente de la armonía activa: explorar otras relaciones no modifica los colores ya elegidos.
- La paleta vacía muestra «Añade tu primer color» y una acción directa desde la rueda. Exportar imagen queda deshabilitado con la indicación «Añade al menos un color»; al añadirlo se habilita sin pasos extra.
- Un bloqueo impide la edición, eliminación y sustitución por propuestas; permite reordenar. Para cambiar el color se desbloquea explícitamente.
- La generación es una propuesta que se puede previsualizar, aplicar o cancelar. Si todas las muestras están bloqueadas, se explica cómo desbloquearlas.
- Al llegar a 12 muestras, «Añadir» explica el límite y permite sustituir una muestra desbloqueada. Nunca elimina colores silenciosamente.
- Duplicar un color es válido. Reordenar funciona con arrastre y con botones/teclado, también en móvil.
- Las muestras activas o bloqueadas se identifican con iconos, texto accesible y bordes, sin depender solo del color.
- El historial conserva hasta 100 acciones de la sesión; los colores guardados y el borrador sobreviven a la recarga, el historial no.

### Exportación PNG: requisito principal de aceptación

- El panel de exportación muestra una vista previa fiel antes de descargar. Entrar o salir no modifica la paleta.
- Se exportan exactamente las muestras actuales, en su orden y con el color sRGB utilizado en pantalla; nunca se incluye la interfaz de edición.
- La opción por defecto produce una tarjeta sobre fondo neutro, con el nombre de la paleta y códigos HEX. También se ofrece una composición solo con colores.
- Para tarjetas, 1× tiene 1.600 px de lado mayor; 2× tiene 3.200 px. La tira horizontal ajusta su anchura a la cantidad de muestras dentro del mismo límite. La previsualización comunica las dimensiones finales.
- El diseño se adapta a entre 1 y 12 muestras, sin cortar títulos, códigos o colores. Los títulos largos se distribuyen en varias líneas dentro de un máximo visible y comunicado.
- Etiquetas con fondo/contraste legible, incluso cuando las muestras sean muy claras u oscuras. El fondo transparente usa un patrón de transparencia solo en la previsualización.
- Archivo con nombre legible derivado del título y extensión `.png`. Ante un fallo se conserva el trabajo y se permite reintentar.
- Exportación local con fuentes disponibles y dibujo propio; no depende de capturar el DOM, servicios externos ni imágenes remotas.
- Una imagen sirve para usar o compartir la paleta; el JSON conserva sus datos editables. El panel explica ambos usos de forma breve.

### Enlaces compartidos

El enlace transporta una instantánea versionada de los colores, título y modelo de rueda en el fragmento de la URL. No depende de identificadores de la biblioteca del emisor ni incluye su historial u otras paletas. Se valida con las mismas reglas que el JSON, con un límite de 8 KiB para el estado codificado. Al abrirlo en otro navegador se muestra una propuesta que puede adoptarse o cancelarse sin sobrescribir el borrador silenciosamente. Si el enlace es inválido o demasiado largo, se conserva el trabajo actual y se ofrece importar/exportar JSON.

## 5. Modelo de color y límites de la simulación

### Tres conceptos distintos

1. **Ángulo de la rueda:** posición geométrica para las relaciones de color; depende de si se utiliza RYB o RGB/HSL.
2. **Color editable:** coordenadas OKLCH para controlar luminosidad, croma y matiz; conversiones para entradas/salidas digitales.
3. **Mezcla:** operación con un método explícito; no se deduce de colocar dos colores en posiciones opuestas.

RYB será una convención artística documentada con 12 anclas e interpolación continua entre ellas. Sus oposiciones incluirán rojo–verde, amarillo–violeta y azul–naranja. El ángulo RYB no se copiará directamente al matiz HSL ni al matiz OKLCH. Las anclas se definirán y validarán visualmente antes de construir la rueda.

RGB/HSL utilizará su propio recorrido angular. Las armonías se calculan en el modelo activo: complementaria +180°, tríada +120°/+240°, cuadrada +90°/+180°/+270°, análoga ±α, dividida 180°±α y rectangular 0°/α/180°/180°+α. α tendrá límites para evitar puntos duplicados en los modos editables.

La rueda artística ayuda a encontrar relaciones tradicionales, pero no constituye una simulación física de pinturas. Añadir blanco, negro o gris usará RGB lineal con porcentajes digitales; los ajustes perceptivos se identificarán aparte. El valor perceptivo OKLCH L, la luminosidad HSL y la luminancia usada para contraste no se presentarán como magnitudes equivalentes.

### Coherencia y precisión

- Estado del color en coma flotante; redondeo únicamente para mostrar o serializar con precisión documentada. Ni el número de sectores ni la rasterización reducen la precisión del selector.
- Salida inicial sRGB para coherencia entre navegador, portapapeles e imágenes. Si un color OKLCH queda fuera de gama, reducir su croma mediante una política común, conservar el solicitado para edición y mostrar discretamente el ajuste.
- Todas las vistas y exportaciones consumen el mismo color resultante. Los códigos de exportación describen el resultado mostrado, no unas coordenadas fuera de gama sin ajustar.
- Al editar un gris se conserva el último matiz útil para recuperarlo al aumentar el croma. Blancos y negros no provocan valores indefinidos en la interfaz.
- Al introducir un color externo se conserva su color; se calcula su posición equivalente en el modelo, sin forzarlo a una de las 12 anclas. La transformación inversa y sus tolerancias se validan en el motor.
- Cambiar el modelo reubica los marcadores y recalcula las sugerencias; las muestras ya añadidas no cambian.
- Las etiquetas cálido/frío son orientación tradicional contextual, no una temperatura física en kelvin.

## 6. Arquitectura propuesta

| Área | Elección inicial y motivo |
| --- | --- |
| Aplicación | React + TypeScript en modo estricto + Vite; SPA estática apropiada para una herramienta interactiva local. Versiones estables y compatibles verificadas al iniciar implementación y fijadas en lockfile. |
| Estilos | CSS Modules y variables CSS; diseño propio con controles semánticos. Evitar una biblioteca visual pesada para una sola pantalla. |
| Motor de color | Funciones TypeScript puras independientes de React. Culori como biblioteca propuesta para conversión, interpolación y gestión de gama, con adaptador propio para RYB. |
| Estado | `useReducer` + Context para documento, selección e historial. Estado transitorio del arrastre separado; almacenar y registrar historial al finalizar la interacción. |
| Render de rueda | Canvas para el campo cromático continuo y SVG para marcadores, líneas y etiquetas. Controles HTML equivalentes para toda interacción esencial. |
| Exportación | Renderizador Canvas independiente de la interfaz, alimentado por un modelo compartido de composición. El mismo modelo produce vista previa y PNG con `toBlob`. |
| Persistencia | `localStorage` para borrador y biblioteca pequeña, con esquema versionado, validación y recuperación de errores. |
| Calidad | Vitest para el motor y estado; React Testing Library para edición; Playwright para recorridos y exportación real. ESLint, comprobación de tipos y build. |
| Publicación | Artefactos estáticos en un alojamiento a elegir al publicar. Sin backend, autenticación ni servicios de pago necesarios en v1. |

Organización prevista:

```text
src/
  app/                   # Composición, proveedores y estilos base
  domain/color/          # Conversiones, RYB, armonías, mezclas y gama
  domain/palette/        # Documento de paleta, bloqueos e historial
  features/wheel/        # Rueda y controles
  features/harmonies/    # Propuestas de armonía
  features/mixer/        # Mezclas y variaciones
  features/palette/      # Editor y biblioteca local
  features/export/       # Composición, previsualización y descarga
  shared/                # Controles accesibles y utilidades comunes
tests/                   # Integración y recorridos completos
```

El documento de paleta contendrá versión de esquema, identificador, título, muestras ordenadas con identificadores estables, color solicitado, nombre y bloqueo. El modelo de rueda, selección, ajustes de herramientas y configuración de exportación pertenecerán al espacio de trabajo. Conversiones, colores mostrados y armonías se derivarán sin duplicar fuentes de verdad.

## 7. Fases de implementación y entregables

Cada fase termina con una demostración verificable. No se declara la versión 1.0 terminada hasta superar las seis fases.

| Fase | Entrega | Funciones | Evidencia para avanzar |
| --- | --- | --- | --- |
| 1. Contrato de experiencia y base | Wireframes de escritorio/móvil del recorrido completo, comportamiento de selección y bloqueo, plantilla de PNG y proyecto React/TS | Base para todas | Prototipo del recorrido «elegir → paleta → PNG» revisable; tipos y build correctos |
| 2. Motor y selección continua | Modelos de color, política de gama, rueda y controles sincronizados | F01–F03 | Selección de matices intermedios, anclas RYB y continuidad 360° verificadas |
| 3. Recorrido completo mínimo | Editor de paleta, deshacer/rehacer, borrador y primer exportador PNG con vista previa | Núcleo F07–F10 | Crear, editar, reordenar, recargar y descargar una paleta propia de principio a fin |
| 4. Herramientas para experimentar | Armonías, variantes, mezclador y generación que respeta bloqueos | F04–F06 y resto F07 | Comparar propuestas, aplicarlas y deshacer sin perder colores propios |
| 5. Biblioteca y exportación completa | Gestión local, composiciones PNG definitivas, JSON, CSS y enlaces | Resto F09–F11 | Datos recuperables, importación validada y PNG correcto para 1–12 muestras |
| 6. Calidad de experiencia y entrega | Accesibilidad, contraste, ayuda, ajustes de móvil, rendimiento y documentación | F12 y acabado transversal | Pruebas de aceptación, recorrido táctil/teclado y revisión visual de imágenes exportadas |

La fase 3 permite probar pronto la utilidad principal; las herramientas adicionales se integran sobre ese recorrido. Se evita posponer la exportación hasta el final.

## 8. Verificación y criterios de aceptación de v1

| Área | Prueba que debe pasar |
| --- | --- |
| Utilidad | Una persona puede crear una paleta de cuatro colores y exportarla sin consultar la ayuda ni registrarse. Probar con al menos tres personas si están disponibles; en su defecto, registrar esa validación como pendiente, sin inventar resultados. |
| Colores intermedios | Seleccionar dos ángulos distintos dentro del mismo sector produce colores distintos; cruzar 359,9°→0° no causa un salto artificial. |
| Modelos | Anclas y parejas RYB correctas según la convención documentada; armonías calculadas sobre el modelo activo. |
| Precisión | Conversiones de referencia y recorridos sRGB de ida/vuelta con error máximo de 1 unidad por canal de 8 bits para colores dentro de gama. Negros, blancos y grises sin `NaN`. |
| Paleta | Añadir, editar, duplicar y reordenar no cambia otras muestras; bloqueos respetados; cancelar una propuesta no muta la paleta. Vaciar permite seguir creando y deshabilita la exportación hasta añadir una muestra. |
| Recuperación | Deshacer restaura valores, orden y bloqueos; recargar recupera el borrador; datos corruptos no impiden abrir la aplicación. |
| Exportación visual | Descargar PNG reales para 1, 4 y 12 muestras, ambos diseños y fondos disponibles; verificar dimensiones, orden, etiquetas y transparencia. Comparar píxeles interiores de muestras con el sRGB esperado con tolerancia de 1 unidad por canal. |
| Exportación fiel | Vista previa y archivo comparten composición; inspección visual sin textos cortados, muestras ausentes ni elementos de la interfaz. |
| Importación | JSON exportado se vuelve a importar preservando colores, orden, nombres y bloqueos. Rechazar esquemas desconocidos y datos inválidos con un mensaje recuperable. |
| Compartir | Un enlace abierto en un contexto sin datos locales reproduce sus colores y modelo; adoptarlo requiere una acción explícita y un enlace corrupto no sobrescribe el borrador. |
| Accesibilidad | Completar selección, edición, reordenación y exportación con teclado; revisión con lector de pantalla y comprobación automatizada de problemas detectables. |
| Móvil | Uso a 360 px de ancho sin desplazamiento horizontal; objetivos táctiles principales de 44 px, orientación vertical/horizontal y arrastre sin bloquear el desplazamiento general. |
| Rendimiento | Medir arrastre en escritorio y un móvil de referencia identificado: objetivo de actualización visual de al menos 50 fps y sin pausas superiores a 100 ms en la interacción habitual. Ajustar el render si la medida falla. |
| Navegadores | Recorridos en Chrome, Firefox y Safari estables disponibles al desarrollar, incluyendo exportación en Safari iOS cuando se disponga de dispositivo. Registrar cobertura real y limitaciones. |
| Construcción | Tipos, lint, pruebas relevantes y build de producción correctos; ausencia de errores de consola en el recorrido principal. |

Antes de publicar o subir una rama se actualizarán CHANGELOG.md, README y, si existen para entonces, los archivos de novedades de Home indicados en las instrucciones del proyecto. Hoy no existen esos archivos de Home y no se crearán módulos ficticios para esta planificación.

## 9. Funciones futuras y mejoras

El siguiente listado es una hoja de ruta priorizada, no un compromiso cerrado de versiones o fechas. Priorizar según observación del uso real, especialmente la creación y exportación de paletas.

| Prioridad propuesta | Mejora | Valor y dependencia |
| --- | --- | --- |
| V1.1 | Extraer paletas desde una fotografía local | Punto de partida rápido; selector sobre imagen, recorte y extracción de dominantes sin subir archivos |
| V1.1 | Más plantillas de imagen | Columnas, cuadrículas, proporciones desiguales, notas, nombres por muestra y tamaños personalizados |
| V1.1 | Exportar SVG y PDF | Gráficos vectoriales y fichas imprimibles; mantener el mismo contrato de color y composición |
| V1.1 | Simulación de deficiencias de visión cromática | Comparar paletas en distintos escenarios y mejorar su distinción; validar el modelo utilizado |
| V1.1 | Vista de aplicación de paleta | Previsualizar colores en una ilustración o composición sencilla y comprobar su equilibrio |
| V1.1 | Más atajos e interfaz en inglés | Acelerar el trabajo habitual y ampliar acceso; completar traducciones y ayuda |
| V1.2 | Tableros y múltiples paletas en paralelo | Comparar alternativas, colecciones, etiquetas, búsqueda y paletas de más de 12 colores |
| V1.2 | Mezclas parecidas a pintura | Evaluar un motor de pigmentos, su licencia y sus datos; distinguir material, proporción y límites de la aproximación |
| V1.2 | Instalación PWA y uso sin conexión | Trabajar offline tras instalación; definir actualización, migración y recuperación de datos |
| V1.2 | Armonías personalizadas y escalas avanzadas | Fijar varios colores, ajustar restricciones y construir escalas con control perceptivo |
| V1.2 | Exportaciones profesionales | ASE/GPL, tokens de diseño y metadatos; validar compatibilidad con aplicaciones de destino |
| Más adelante | Display P3 y gestión de gama ampliada | Colores en pantallas compatibles; distinguir valores originales y alternativas sRGB en cada exportación |
| Más adelante | Impresión y perfiles ICC | Soft proof y conversiones según perfil concreto; evitar un «CMYK universal» sin condiciones de impresión |
| Más adelante | Pigmentos y materiales concretos | Bibliotecas de fabricante, fuerza tintórea, opacidad y mezclas basadas en datos disponibles |
| Más adelante | Nube y colaboración opcionales | Sincronización entre dispositivos, historial compartido y enlaces públicos; requerirá backend y decisiones de privacidad |
| Más adelante | Aprendizaje interactivo | Ejercicios de armonía, contraste y mezcla, integrados sin interrumpir la creación libre |

## 10. Decisiones y riesgos a resolver durante el desarrollo

- **Rueda RYB:** revisar la tabla de anclas y sus transiciones antes de pulir el diseño; las fotografías sirven para relaciones, no para calibración.
- **Rueda y controles:** medir la fluidez antes de añadir más geometría; reutilizar el campo cromático cacheado y actualizar solo los marcadores cuando sea posible.
- **Exportación:** validar el primer PNG en la fase 3; probar legibilidad de títulos, 12 muestras y transparencia en varios navegadores antes de ampliar plantillas.
- **Almacenamiento:** el guardado es local al navegador y dispositivo. Indicarlo junto a la biblioteca y facilitar JSON como copia editable.
- **Alcance:** cuentas, IA, simulación física e impresión especializada quedan fuera de v1. El recorrido de paleta y PNG tiene prioridad si hay que ajustar el resto.

## 11. Fuentes técnicas de referencia

- [React: creación de una aplicación desde cero](https://react.dev/learn/build-a-react-app-from-scratch) y [Vite: guía oficial](https://vite.dev/guide/): base propuesta para la SPA.
- [Culori: referencia de API](https://culorijs.org/api/): conversiones, interpolación y funciones de gestión de gama; el adaptador RYB será propio.
- [W3C CSS Color 4](https://www.w3.org/TR/css-color/) y [publicación original de Oklab](https://bottosson.github.io/posts/oklab/): coordenadas de color, representación y base perceptiva.
- [GOLDEN: guía de mezcla](https://goldenartistcolors.com/resources/color-mixing-guide) y [rueda de color](https://goldenartistcolors.com/resources/color-wheel): comportamiento y límites de las mezclas de pigmentos.
- [Mixbox: proyecto de sus autores](https://scrtwpns.com/mixbox/): candidato a estudiar para una futura mezcla de pigmentos; no seleccionado como dependencia inicial.

## 12. Estado al entregar este plan

Se entrega alcance inicial, evolución futura, experiencia principal, arquitectura, fases y pruebas de aceptación. No se han instalado dependencias, implementado pantallas ni ejecutado pruebas de una aplicación inexistente. La revisión de este alcance precede a la implementación.
