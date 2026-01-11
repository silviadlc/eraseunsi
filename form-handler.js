/**
 * Manejador del formulario de asistencia para enviar datos a Google Apps Script
 */

// URL del Google Apps Script (debes reemplazar con tu URL después de desplegarlo)
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxf3OLq8Pa9VijpQMIfFiQjf9NH2RiSs49FWwHxWwdwLxVdMJru8VtwJgpNXZhFC-Ie/exec";

/**
 * Inicializar el manejador del formulario cuando se carga la página
 */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("rsvp-form");
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }
});

/**
 * Maneja el envío del formulario
 */
async function handleFormSubmit(event) {
  event.preventDefault(); // Prevenir el envío normal del formulario

  const form = event.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const spinner = document.getElementById("loading-spinner");

  try {
    // Mostrar spinner de carga
    if (spinner) {
      spinner.classList.remove("hidden");
    }

    // Deshabilitar el botón de envío y mostrar estado de carga
    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";

    // Recopilar datos del formulario
    const formData = new URLSearchParams();

    // Agregar campos de texto
    formData.append("name", form.name.value);
    formData.append("dormir", form.dormir.value);
    formData.append("alergia", form.alergia.value);
    formData.append("diet", form.diet.value);

    // Manejar la imagen si existe
    const imageFile = form.imagen.files[0];
    if (imageFile) {
      const imageBase64 = await convertFileToBase64(imageFile);
      formData.append("imagen", imageBase64);
    }

    // Enviar datos a Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      showPopup(
        "¡Confirmación enviada correctamente! Gracias por confirmar tu asistencia.",
        "success"
      );
      form.reset(); // Limpiar el formulario
    } else {
      throw new Error(result.message || "Error desconocido");
    }
  } catch (error) {
    console.error("Error enviando formulario:", error);
    showPopup(
      "Hubo un error al enviar tu confirmación. Por favor, inténtalo de nuevo.",
      "error"
    );
  } finally {
    // Ocultar spinner de carga
    if (spinner) {
      spinner.classList.add("hidden");
    }

    // Restaurar el botón de envío
    submitButton.disabled = false;
    submitButton.textContent = "Enviar confirmación";
  }
}

/**
 * Convierte un archivo a Base64
 */
function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Muestra un popup con un mensaje
 */
function showPopup(message, type = "info") {
  const popup = document.getElementById("popup");
  const popupText = document.getElementById("popup-text");
  const popupClose = document.getElementById("popup-close");

  if (popup && popupText) {
    popupText.textContent = message;
    popup.classList.remove("hidden");

    // Agregar clase de tipo si es necesario
    popup.className = `popup ${type}`;

    // Manejar el cierre del popup
    if (popupClose) {
      popupClose.onclick = () => {
        popup.classList.add("hidden");
      };
    }

    // Cerrar automáticamente después de 5 segundos si es exitoso
    if (type === "success") {
      setTimeout(() => {
        popup.classList.add("hidden");
      }, 5000);
    }
  }
}

/**
 * Validación adicional del formulario (opcional)
 */
function validateForm(form) {
  const requiredFields = ["name", "dormir", "alergia"];

  for (const fieldName of requiredFields) {
    const field = form[fieldName];
    if (!field || !field.value.trim()) {
      showPopup(
        `Por favor, completa el campo: ${getFieldLabel(fieldName)}`,
        "error"
      );
      return false;
    }
  }

  return true;
}

/**
 * Obtiene la etiqueta legible de un campo
 */
function getFieldLabel(fieldName) {
  const labels = {
    name: "Nombre completo",
    dormir: "¿Te gustaría quedarte a dormir?",
    alergia: "¿Tienes alguna intolerancia o alergia alimentaria?",
    diet: "Comentarios sobre dieta",
    imagen: "Imagen",
  };

  return labels[fieldName] || fieldName;
}
