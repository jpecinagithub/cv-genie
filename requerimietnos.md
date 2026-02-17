# Requerimientos del Proyecto - CV Genie

## 1. Descripción general
CV Genie es una aplicación web para generar currículums a partir de texto libre o formulario estructurado, previsualizarlos con distintas plantillas y exportarlos a PDF, DOCX o impresión.

## 2. Tecnologías utilizadas
### Frontend
- React 18 + TypeScript
- Vite 5 (bundler y servidor de desarrollo)
- React Router DOM 6 (ruteo)

### UI y estilos
- Tailwind CSS 3
- shadcn/ui + Radix UI (componentes accesibles)
- Lucide React (iconos)
- Sonner y sistema de toast de shadcn (notificaciones)

### Estado y formularios
- Context API (estado principal de CV)
- localStorage (persistencia local de datos)
- React Hook Form + Zod (validación en formularios)
- TanStack React Query (infraestructura de datos, ya configurada)

### Exportación de documentos
- html2canvas + jsPDF (exportación PDF)
- docx (exportación DOCX)
- react-to-print (impresión)

### Calidad y testing
- ESLint 9 + TypeScript ESLint
- Vitest + Testing Library + JSDOM

## 3. Requerimientos funcionales
- Ingreso de información por:
  - Formulario estructurado.
  - Texto libre para parseo automático.
- Parseo de CV en español e inglés con detección de secciones comunes (Resumen, Experiencia, Educación, Habilidades, etc.).
- Generación de estructura estándar de CV (`name`, `contactInfo`, `summary`, `sections`).
- Selección de 5 plantillas:
  - `minimal`
  - `two-column`
  - `modern-header`
  - `executive`
  - `compact`
- Previsualización del CV antes de exportar.
- Exportación a:
  - PDF (`.pdf`)
  - Word (`.docx`)
  - Impresión
- Persistencia local de borradores y preferencias (texto, plantilla, perfil).
- Posibilidad de resetear el estado completo del CV.

## 4. Requerimientos no funcionales
- Aplicación SPA (Single Page Application) ejecutada en navegador.
- Interfaz responsiva (layout con panel lateral + vista previa).
- Renderizado rápido en desarrollo mediante Vite.
- Accesibilidad base heredada de Radix UI/shadcn.
- Compatibilidad con navegadores modernos que soporten ES Modules, `localStorage` y APIs Blob/URL.

## 5. Requerimientos de entorno
- Node.js instalado (recomendado: versión LTS actual).
- npm para gestión de dependencias.
- Sistema operativo compatible con Node.js (Windows, Linux o macOS).

## 6. Scripts del proyecto
- `npm run dev`: inicia servidor de desarrollo (Vite, puerto 8080).
- `npm run build`: compila a producción.
- `npm run build:dev`: build en modo development.
- `npm run preview`: sirve el build localmente.
- `npm run lint`: ejecuta ESLint.
- `npm run test`: ejecuta pruebas con Vitest.
- `npm run test:watch`: pruebas en modo observación.

## 7. Estructura técnica relevante
- `src/context/CvContext.tsx`: estado global del CV y persistencia local.
- `src/lib/parser.ts`: parser de texto libre a estructura de CV.
- `src/lib/export-pdf.ts`: lógica de exportación PDF.
- `src/lib/export-docx.ts`: lógica de exportación DOCX.
- `src/components/templates/*`: plantillas de visualización.
- `src/types/cv.ts`: contratos de datos (`CvData`, `TemplateName`).

## 8. Dependencias críticas a vigilar
- Librerías de exportación (`jspdf`, `html2canvas`, `docx`) por impacto en tamaño de bundle y compatibilidad.
- Stack UI (`@radix-ui/*`, `tailwindcss`, `shadcn`) por cambios de estilos/componentes.
- Tooling (`vite`, `typescript`, `vitest`, `eslint`) por posibles breaking changes en upgrades mayores.

## 9. Riesgos y consideraciones
- El parser es heurístico: distintos formatos de CV pueden requerir ajustes de patrones.
- La exportación PDF depende del render del DOM; estilos complejos pueden variar entre navegadores.
- La persistencia en `localStorage` no sincroniza entre dispositivos ni usuarios.
- No hay backend: toda la información se procesa en cliente.

## 10. Mejoras recomendadas (siguientes pasos)
- Definir versión mínima de Node en `.nvmrc` o campo `engines` en `package.json`.
- Ampliar cobertura de tests del parser y exportadores.
- Incorporar i18n formal para interfaz ES/EN.
- Evaluar lazy loading de componentes/UI para optimizar rendimiento inicial.
