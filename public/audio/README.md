# Música opcional

Coloca aquí dos archivos MP3 reales que tengas derecho a utilizar:

- `portfolio-es.mp3` → `/audio/portfolio-es.mp3`
- `portfolio-en.mp3` → `/audio/portfolio-en.mp3`

No se incluyen pistas ficticias. Mientras faltan, el control permanece deshabilitado.
El reproductor comprueba disponibilidad una sola vez por idioma y sesión mediante HEAD,
sin descargar el audio. El servidor debe entregar `audio/mpeg` (o un tipo `audio/*`).
Una respuesta HTML de fallback no se considera una pista válida.

Después de agregar los archivos, recarga la página para volver a comprobarlos.
La reproducción siempre requiere un clic. Cambiar idioma pausa la pista, y nunca
reanuda música automáticamente. Solo se recuerda el volumen, no la reproducción.
