# Catálogo de pinturas

La aplicación incluye un catálogo local de pinturas con nombre, gama, referencia y código HEX.

## Funcionamiento

- El selector de gamas conserva el orden del índice de rangos usado durante la sincronización.
- La búsqueda acepta nombre, referencia del fabricante, gama y HEX.
- Al elegir una pintura, su HEX se conserva exactamente en la rueda digital.
- Las coincidencias se ordenan por distancia de color OKLab.

## Seleccionar pinturas para una paleta o mezcla

Desde «Añadir pintura» en la paleta o en el mezclador se abre un selector contextual. Marca y gama se filtran por separado; la búsqueda admite varios términos de nombre, referencia, tipo o HEX y no distingue acentos. Las marcas favoritas ofrecen accesos directos y las pinturas recientes facilitan repetir selecciones. Los filtros se recuerdan en el navegador.

La selección se aplica al ingrediente solicitado o añade una muestra a la paleta. Conserva la pintura concreta con su nombre, marca, gama y referencia; editar libremente su HEX elimina esa asociación. Los resultados de mezcla se guardan con una instantánea de su receta y pueden exportarse como PNG desde el mezclador o el detalle de la muestra.

Cada ingrediente tiene sus propias partes y la mezcla permanece independiente de la rueda. El resultado es una estimación digital RGB; las equivalencias indican similitud de color. El flujo utiliza el catálogo y las paletas existentes, sin inventario de botes.

## Actualización del catálogo

El catálogo se entrega ya generado. Si se necesita actualizar con un origen compatible, usa:

    npm run sync:catalog -- <origen-del-catalogo>

El origen debe ofrecer un índice en `/paints/by-range`, páginas de gama bajo `/paints/:slug` y pinturas mediante `/api/paints?paint_range_id=<id>`.
