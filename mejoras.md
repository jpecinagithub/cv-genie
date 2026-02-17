# Mejoras Implementadas - CV Genie

## 1. Flujo de formulario y navegación
- Se creó una página dedicada para formulario estructurado: `/form`.
- Se movió el selector entre `Texto libre` y `Formulario` a navegación entre páginas.
- Se eliminó la lista de plantillas en el bloque inferior y se movió la selección al menú superior.
- Se añadió un selector visual mejorado para plantilla (`TemplateSelect`) y también selector de idioma de títulos (ES/EN).

## 2. Sesión temporal de 30 minutos
- Se implementó sesión de 30 minutos al entrar en `/form`.
- Se añadió contador visible `mm:ss` en la cabecera del formulario.
- El contador entra en estado de alerta cuando quedan 5 minutos.
- La sesión ya no se reinicia al recargar/entrar si sigue activa (comportamiento idempotente).
- Al expirar la sesión:
  - se limpia estado y datos `cv-*` de `localStorage`,
  - se emite evento `cv-session-expired`,
  - se notifica al usuario.

## 3. UX de expiración (sin alert bloqueante)
- Se reemplazó `alert()` por notificaciones `toast`.
- Se añadieron preavisos automáticos:
  - aviso a 5 minutos,
  - aviso a 1 minuto,
  - aviso de expiración y borrado de datos.

## 4. Persistencia y robustez de almacenamiento
- Se mantuvo persistencia de estado principal en `localStorage` (`cv-data`, `cv-template`, `cv-profile`, etc.).
- Se añadió persistencia completa del formulario estructurado (`cv-structured-form`).
- Se mejoró la inicialización del formulario para parsear `localStorage` una sola vez (menos sobrecarga).
- Se añadieron helpers seguros de almacenamiento en contexto (`safeSetItem`, `safeRemoveItem`) para evitar roturas por cuota o errores de storage.
- Se añadió manejo de error de cuota al guardar formulario, con toast de aviso.
- Se endureció lectura de `localStorage` en contexto:
  - `cv-data` con parse seguro y limpieza automática si JSON inválido.
  - validación estricta de `cv-template` contra templates permitidas.
  - validación estricta de `cv-section-language` (`es|en`).
  - lectura segura con `safeGetItem` para evitar crashes por restricciones del navegador.

## 5. Campo de identidad y datos personales
- Se añadió campo `Profesión` separado del nombre en el formulario.
- Se añadió soporte opcional de fotografía:
  - carga de imagen,
  - vista previa,
  - opción de quitar.
- Se incluyó `profession` y `photoUrl` en el modelo `CvData`.

## 6. Hardening de fotografía
- Se validó tipo de archivo de imagen.
- Se limitó tamaño máximo de archivo (2MB).
- Se añadió optimización previa al guardado:
  - reducción de dimensión máxima,
  - compresión JPEG.
- Se añadió control de tamaño final del data URL y mensajes de error/éxito.

## 7. Mejoras en formulario estructurado
- El formulario carga expandido por defecto (acordeón abierto).
- Se movieron botones de acción al final del contenido para ampliar área útil de edición.
- Se aumentó altura de textareas clave (skills y descripción de experiencia).
- `Skills` ahora:
  - convierte comas en saltos de línea,
  - guarda y genera una skill por línea.
- Nivel de idioma cambió a selector cerrado con opciones:
  - `Basic`, `Intermediate`, `Advanced`, `Fluent`, `Native`.
- Se actualizó CTA principal a `Generar CV` (antes `Generar 5 CVs`).

## 8. Lógica de experiencia/formación
- Formato de experiencia actualizado: `Cargo | Empresa (Periodo)`.
- En render y DOCX:
  - en formación, `Título/Grado` va en negrita,
  - en experiencia, solo `Cargo | Empresa` va en negrita,
  - fechas y descripción quedan en normal.

## 9. Plantillas y diseño
- Se ajustó estilo de profesión para mayor presencia visual.
- En plantilla de dos columnas, profesión centrada bajo el nombre.
- Se añadieron iconos representativos por contacto (email, teléfono, web, GitHub, LinkedIn, ubicación).
- Se corrigieron iconos para mejor visibilidad.
- Se añadieron 3 nuevas plantillas estilo dos columnas:
  - `Dos Columnas Zafiro`,
  - `Dos Columnas Esmeralda`,
  - `Dos Columnas Borgoña`.

## 10. Refactor de plantillas dos columnas
- Se extrajo una base común `TwoColumnBaseTemplate`.
- Las 4 variantes de dos columnas ahora son wrappers de tema (colores, ancho, bordes, etc.).
- Se redujo duplicación y mejoró mantenibilidad sin alterar comportamiento funcional.

## 11. Internacionalización de títulos (ES/EN)
- Se añadió selector ES/EN para títulos de secciones.
- Se implementó traducción en preview y exportación DOCX.
- Se migró a i18n estructural por `section.key`:
  - se agregó `SectionKey` y `key` en `CvSection`,
  - parser y formulario generan claves internas,
  - plantillas y DOCX usan `key` (no texto literal),
  - fallback para datos antiguos por título.

## 12. Exportaciones
- DOCX actualizado para reflejar:
  - profesión,
  - traducción de secciones,
  - formato de negritas en experiencia/formación.
- Se robusteció descarga DOCX:
  - ancla temporal insertada en DOM para mayor compatibilidad,
  - `URL.revokeObjectURL` diferido (evita cortes prematuros en algunos navegadores).
- PDF se mantuvo estable y cubierto por tests.

## 13. Calidad técnica
- Se resolvieron errores de lint y se dejó `lint` limpio.
- Se añadieron exclusiones puntuales para warnings de Fast Refresh en módulos utilitarios de UI/contexto.

## 14. Testing
- Se eliminaron tests dummy.
- Se añadieron suites reales para:
  - parser,
  - traducción de secciones,
  - contexto (generación + expiración de sesión),
  - formulario estructurado,
  - exportación PDF,
  - exportación DOCX.
- Estado actual: tests en verde.

## 15. CI/CD
- Se creó workflow de GitHub Actions: `.github/workflows/ci.yml`.
- Ejecuta en `push` y `pull_request`:
  - `npm ci`,
  - `npm run lint`,
  - `npm run test`.

## 16. Documentación
- Se creó `requerimietnos.md` con requerimientos técnicos/funcionales.
- Se añadieron mejoras progresivas según feedback de UI y flujo.

## 17. Ajustes recientes de UX e idioma
- Sincronización automática de idioma:
  - al cambiar idioma de secciones, se actualiza también `cvData.sectionLanguage` sin necesidad de regenerar.
  - preview y exportaciones reflejan el cambio inmediatamente.
- Limpieza de textos visibles:
  - correcciones de tildes y ortografía (`Sesión`, `Títulos`, `español`).
  - homogeneización de copys al español en cabecera y subtítulos principales.
- Estado actual de calidad:
  - `lint` en verde.
  - suite de tests en verde (`10/10`).

## 18. Fallback defensivo de plantillas
- Se añadió fallback en `TemplateRenderer` para evitar crash si llega un `template` inválido en runtime.
- Comportamiento: si la plantilla no existe en `TEMPLATE_MAP`, se renderiza automáticamente `minimal`.
