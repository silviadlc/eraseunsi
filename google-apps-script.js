/**
 * Google Apps Script para manejar el formulario de asistencia de boda
 * Este script recibe los datos del formulario, los guarda en Google Sheets
 * y sube las imágenes a Google Drive
 */

// IDs de Google Sheets y Drive (reemplazar con los tuyos)
const SHEET_ID = "1SmmFju-mcY_q7yuJdyGW_ZNOXecbWmJ3y6H8qtICvf8"; // ID del Google Sheets
const DRIVE_FOLDER_ID = "1wb82-MtPAk5g0sM9K98vRtJLOJGBPpuA"; // ID de la carpeta de Drive

/**
 * Función principal que maneja las peticiones POST del formulario
 */
function doPost(e) {
 try {
  // Verificar que el objeto e existe
  if (!e) {
   throw new Error("Objeto de evento no definido");
  }

  // Obtener los parámetros del formulario
  const params = e.parameter || {};

  // Extraer datos del formulario - TODOS los campos siempre se envían
  const nombre = params.name || "";
  const dormir = params.dormir || "";
  const noches = params.noches || ""; // Vacío si no aplica
  const vegetariano = params.vegetariano || "";
  const alergia = params.alergia || "";
  const diet = params.diet || "";

  // Validar que al menos el nombre esté presente
  if (!nombre.trim()) {
   throw new Error("El nombre es requerido");
  }

  // Procesar imagen si existe
  let imagenUrl = "";

  if (params.imagen && params.imagen.trim() !== "") {
   try {
    imagenUrl = uploadImageToDrive(params.imagen, nombre);
   } catch (error) {
    console.error("Error subiendo imagen:", error);
    console.error("Stack trace:", error.stack);
    imagenUrl = "Error al subir imagen: " + error.toString();
   }
  } else {
   imagenUrl = "Sin imagen";
  }

  // Guardar datos en Google Sheets
  const resultado = saveToSheet(
   nombre,
   dormir,
   noches,
   vegetariano,
   alergia,
   diet,
   imagenUrl
  );

  // Respuesta exitosa
  return ContentService.createTextOutput(
   JSON.stringify({
    success: true,
    message: "Formulario enviado correctamente",
    data: resultado,
   })
  ).setMimeType(ContentService.MimeType.JSON);
 } catch (error) {
  console.error("Error en doPost:", error);

  // Respuesta de error
  return ContentService.createTextOutput(
   JSON.stringify({
    success: false,
    message: "Error al procesar el formulario: " + error.toString(),
   })
  ).setMimeType(ContentService.MimeType.JSON);
 }
}

/**
 * Función para manejar peticiones GET (opcional, para testing)
 */
function doGet(e) {
 return ContentService.createTextOutput(
  JSON.stringify({
   message: "Endpoint del formulario de boda funcionando correctamente",
  })
 ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Guarda los datos del formulario en Google Sheets
 */
function saveToSheet(
 nombre,
 dormir,
 noches,
 vegetariano,
 alergia,
 diet,
 imagenUrl
) {
 try {
  // Intentar abrir el Google Sheets
  let sheet;
  try {
   sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  } catch (error) {
   console.error("No se puede acceder a la hoja especificada:", error);

   // Crear una nueva hoja de cálculo
   const newSpreadsheet = SpreadsheetApp.create("Formulario Boda - Respuestas");
   sheet = newSpreadsheet.getActiveSheet();
  }

  // Verificar si existe cabecera, si no, crearla
  if (sheet.getLastRow() === 0) {
   sheet
    .getRange(1, 1, 1, 9)
    .setValues([
     [
      "Timestamp",
      "Nombre Completo",
      "¿Quedarse a dormir?",
      "¿Qué noches?",
      "¿Menú vegetariano?",
      "¿Tiene alergias?",
      "Comentarios sobre dieta/alergias",
      "URL de la imagen",
     ],
    ]);
  }

  // Preparar los datos para insertar
  const timestamp = new Date();
  const rowData = [
   timestamp,
   nombre,
   dormir,
   noches,
   vegetariano,
   alergia,
   diet,
   imagenUrl,
  ];

  // Insertar nueva fila
  sheet.appendRow(rowData);

  return {
   row: sheet.getLastRow(),
   timestamp: timestamp,
   nombre: nombre,
  };
 } catch (error) {
  console.error("Error guardando en Sheet:", error);
  throw new Error("No se pudo guardar en Google Sheets: " + error.toString());
 }
}

/**
 * Sube una imagen a Google Drive
 */
function uploadImageToDrive(imageData, nombrePersona) {
 try {
  // Obtener la carpeta de destino

  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);

  // Verificar que imageData existe y tiene el formato correcto
  if (!imageData || typeof imageData !== "string") {
   throw new Error(
    "Datos de imagen inválidos - imageData: " + typeof imageData
   );
  }

  // Extraer el tipo de imagen y los datos base64
  const matches = imageData.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) {
   throw new Error("Formato de imagen base64 inválido");
  }

  const mimeType = matches[1];
  const base64Data = matches[2];

  // Determinar la extensión del archivo
  let extension = "jpg";
  if (mimeType.includes("png")) extension = "png";
  else if (mimeType.includes("gif")) extension = "gif";
  else if (mimeType.includes("webp")) extension = "webp";
  else if (mimeType.includes("svg")) extension = "svg";
  else if (mimeType.includes("jpeg")) extension = "jpeg";
  else if (mimeType.includes("heic")) extension = "heic";
  else if (mimeType.includes("dng")) extension = "dng";

  // Decodificar la imagen
  const blob = Utilities.newBlob(
   Utilities.base64Decode(base64Data),
   mimeType,
   `${nombrePersona.replace(
    /[^a-zA-Z0-9]/g,
    "_"
   )}_${new Date().getTime()}.${extension}`
  );

  // Crear el archivo en Drive
  const file = folder.createFile(blob);

  // Hacer el archivo público para lectura
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return file.getUrl();
 } catch (error) {
  console.error("Error subiendo imagen a Drive:", error);
  throw new Error("No se pudo subir la imagen a Drive: " + error.toString());
 }
}

/**
 * Función de testing (opcional)
 */
function testFunction() {
 // Test de conexión a Sheets
 try {
  const sheet = SpreadsheetApp.openById(SHEET_ID);
 } catch (error) {
  console.error("Error conectando a Sheets:", error);
 }

 // Test de conexión a Drive
 try {
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
 } catch (error) {
  console.error("Error conectando a Drive:", error);
 }
}

/**
 * Función para simular una petición POST (solo para testing)
 */
function testDoPost() {
 // Simular el objeto de evento que recibiría doPost
 const mockEvent = {
  parameter: {
   name: "Test Usuario",
   dormir: "Sí",
   noches: "Ambos",
   vegetariano: "No",
   alergia: "No",
   diet: "Sin restricciones especiales",
   // Nota: no incluimos imagen en el test para simplificar
  },
 };

 try {
  const result = doPost(mockEvent);
 } catch (error) {
  console.error("Error en test:", error);
 }
}

/**
 * Función para probar específicamente la subida de imágenes
 */
function testImageUpload() {
 // Crear una imagen base64 de prueba muy pequeña (1x1 pixel rojo)
 const testImageBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==";

 try {
  const result = uploadImageToDrive(testImageBase64, "TestUsuario");
  return result;
 } catch (error) {
  console.error("Stack trace:", error.stack);
  throw error;
 }
}

/**
 * Función para probar permisos de Drive
 */
function testDrivePermissions() {
 try {
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);

  // Intentar crear un archivo de texto simple
  const testFile = folder.createFile(
   "test.txt",
   "Archivo de prueba",
   "text/plain"
  );

  // Eliminar el archivo de prueba
  testFile.setTrashed(true);

  return true;
 } catch (error) {
  console.error("❌ Error de permisos de Drive:", error);
  throw error;
 }
}
