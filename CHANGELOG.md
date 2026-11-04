# Changelog

## 2026-11-03

- Integrado un catálogo reproducible de 7.376 pinturas en 62 gamas, con nombre, gama, referencia y código HEX.
- Añadida biblioteca filtrable y las cinco coincidencias más cercanas bajo el color actual; seleccionar una pintura conserva su HEX exacto.
- La rueda ampliada ahora se mantiene circular: tres anillos clicables ofrecen versiones profundas, medias y claras del matiz.
- El mezclador admite el color actual y hasta cinco aportes adicionales, con partes independientes por color.
- Documentadas las llamadas de API, identificadores numéricos de las gamas y alias de tres caracteres comprobados.
- El selector de gamas ahora se genera explícitamente desde el índice público `/paints/by-range`; añadidos los alias validados `TTC` y `WTP`.
- Neutralizada la presentación del catálogo: la aplicación y la documentación lo muestran como biblioteca propia de pinturas, sin referencias al proveedor de origen.
- El resultado del mezclador muestra ahora las cinco equivalencias de pintura más cercanas; se pueden tocar para llevar su HEX exacto a la rueda.
- Ajustada la experiencia móvil: cabecera de rueda flexible y equivalencias táctiles de 44 px.

## 2026-11-04

- Configurada la URL pública de Vercel en canonical, metadatos sociales, schema, sitemap y `robots.txt`; el generador SEO usa el runtime moderno del proyecto.
- Unificado el icono del navegador con el distintivo cromático de la cabecera y versionada su URL para renovar la caché del favicon.
- Establecida la base SEO: metadatos de búsqueda y sociales, schema de aplicación web, canonical sin hashes y generación segura de `robots.txt`/sitemap desde `SITE_URL`.
- Añadida la herramienta Foto: analiza la imagen localmente, permite extraer entre 4 y 12 colores predominantes y crear o ampliar una paleta con sus equivalencias de pintura.
- La exportación PNG se traslada al Estudio de color e incorpora hasta ocho equivalencias por muestra, con nombre, marca, gama, referencia o tipo y HEX.
- Configurado el build de producción para Node 24.x y eliminado el requisito de fnm en runtimes compatibles.
- Los scripts npm seleccionan Node 26.13.0 mediante fnm, incluso desde terminales ya abiertas con Node 18.
- Las fichas de la biblioteca ahora identifican el tipo de pintura como una etiqueta independiente y permiten buscarlo.
- Añadida una preferencia local de marcas favoritas que restringe todas las equivalencias de pintura; cada muestra del Estudio de color muestra tres equivalencias compactas.
- Las marcas favoritas cuentan ahora con una página propia, tarjetas visuales con monogramas locales y selección por estrella.
- Primera entrega de ColorWheel: rueda continua RYB/RGB, armonías, mezclas, variaciones y un editor de paletas.
- Guardado local, historial de cambios, biblioteca local y salidas PNG, JSON y variables CSS.
- Base React + TypeScript con Vite y requisito de Node 26.13.0.
