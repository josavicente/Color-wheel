# Changelog

## 2026-11-03

- Integrada la API pública de PaintPad: catálogo reproducible de 7.376 pinturas en 62 gamas, con nombre, gama, referencia y código HEX.
- Añadida biblioteca PaintPad filtrable y las cinco coincidencias más cercanas bajo el color actual; seleccionar una pintura conserva su HEX exacto.
- La rueda ampliada ahora se mantiene circular: tres anillos clicables ofrecen versiones profundas, medias y claras del matiz.
- El mezclador admite el color actual y hasta cinco aportes adicionales, con partes independientes por color.
- Documentadas las llamadas de API, identificadores numéricos de las gamas y alias de tres caracteres comprobados.
- Los scripts npm seleccionan Node 26.13.0 mediante fnm, incluso desde terminales ya abiertas con Node 18.
- Primera entrega de ColorWheel: rueda continua RYB/RGB, armonías, mezclas, variaciones y un editor de paletas.
- Guardado local, historial de cambios, biblioteca local y salidas PNG, JSON y variables CSS.
- Base React + TypeScript con Vite y requisito de Node 26.13.0.
