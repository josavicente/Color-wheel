# Catálogo de pinturas

La aplicación incluye un catálogo local de pinturas con nombre, gama, referencia y código HEX.

## Funcionamiento

- El selector de gamas conserva el orden del índice de rangos usado durante la sincronización.
- La búsqueda acepta nombre, referencia del fabricante, gama y HEX.
- Al elegir una pintura, su HEX se conserva exactamente en la rueda digital.
- Las coincidencias se ordenan por distancia de color OKLab.

## Actualización del catálogo

El catálogo se entrega ya generado. Si se necesita actualizar con un origen compatible, usa:

    npm run sync:catalog -- <origen-del-catalogo>

El origen debe ofrecer un índice en `/paints/by-range`, páginas de gama bajo `/paints/:slug` y pinturas mediante `/api/paints?paint_range_id=<id>`.
