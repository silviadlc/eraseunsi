# Instrucciones para Integrar el Formulario con Google Sheets y Drive

## Resumen
Esta guía te ayudará a configurar la integración del formulario de asistencia de tu boda con Google Sheets y Google Drive.

## Archivos Creados
- `google-apps-script.js` - Código para Google Apps Script
- `form-handler.js` - Manejador del formulario en el frontend
- `index.html` - Actualizado para incluir el manejador del formulario

## Pasos de Configuración

### 1. Configurar Google Apps Script

1. Ve a [script.google.com](https://script.google.com)
2. Crea un nuevo proyecto
3. Reemplaza el código por defecto con el contenido de `google-apps-script.js`
4. Guarda el proyecto con un nombre descriptivo (ej: "Formulario Boda")

### 2. Configurar Permisos

1. En Google Apps Script, ve a "Ejecutar" > "Revisar permisos"
2. Autoriza el acceso a Google Sheets y Google Drive
3. Acepta todos los permisos necesarios

### 3. Desplegar como Web App

1. En Google Apps Script, haz clic en "Implementar" > "Nueva implementación"
2. Selecciona tipo: "Aplicación web"
3. Configuración:
   - Ejecutar como: "Yo"
   - Quién tiene acceso: "Cualquier persona"
4. Haz clic en "Implementar"
5. **IMPORTANTE**: Copia la URL de la aplicación web

### 4. Actualizar el Frontend

1. Abre `form-handler.js`
2. Reemplaza `TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI` con la URL que copiaste
3. Guarda el archivo

### 5. Verificar Configuración

- Google Sheets ID: `1SmmFju-mcY_q7yuJdyGW_ZNOXecbWmJ3y6H8qtICvf8`
- Google Drive Folder ID: `1wb82-MtPAk5g0sM9K98vRtJLOJGBPpuA`

### 6. Probar la Integración

1. Abre tu sitio web
2. Rellena el formulario de asistencia
3. Sube una imagen
4. Envía el formulario
5. Verifica que los datos aparezcan en tu Google Sheets
6. Verifica que la imagen se suba a tu carpeta de Drive

## Estructura de Datos en Google Sheets

El script creará automáticamente las siguientes columnas:
- Timestamp
- Nombre Completo
- ¿Quedarse a dormir?
- **¿Qué noches?** (Viernes/Sábado/Ambos/No aplica)
- **¿Menú vegetariano?** (Sí/No)
- ¿Tiene alergias?
- Comentarios sobre dieta/alergias
- URL de la imagen
- Estado

**IMPORTANTE**: Asegúrate de que el Google Apps Script incluya estos campos en el orden correcto:
```javascript
sheet.appendRow([
  new Date(),
  name,
  dormir,
  noches,        // NUEVO: debe estar incluido
  vegetariano,   // NUEVO: debe estar incluido
  alergia,
  diet,
  imageUrl,
  'Procesado'
]);
```

## Solución de Problemas

### Error de permisos
- Asegúrate de haber autorizado todos los permisos en Google Apps Script
- Verifica que la aplicación web esté configurada para "Cualquier persona"

### Formulario no envía
- Verifica que hayas actualizado la URL en `form-handler.js`
- Abre las herramientas de desarrollador del navegador para ver errores

### Imágenes no se suben
- Verifica que el ID de la carpeta de Drive sea correcto
- Asegúrate de que la carpeta tenga permisos de escritura

## Contacto
Si tienes problemas con la configuración, revisa los logs en Google Apps Script o contacta para soporte técnico.
