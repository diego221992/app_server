/**
 * Ayudante de Validaciones para React / React Native
 * Proporciona reglas comunes para formularios y manejo de datos.
 */

export const validate = {
  // 1. Requerido (No vacío)
  required: (value) => {
    return value && value.toString().trim().length > 0
      ? null
      : "Este campo es obligatorio";
  },

  // 2. Correo Electrónico Simple (Mínimo 5 caracteres y debe contener @)
  emailSimple: (value) => {
    const hasAt = value && value.includes('@');
    const isLongEnough = value && value.length >= 5;
    return (hasAt && isLongEnough)
      ? null
      : "Correo no válido (mínimo 5 caracteres y debe incluir @)";
  },

  // 3. Correo Electrónico Estándar (Regex completa)
  emailFull: (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) ? null : "Formato de correo electrónico no válido";
  },

  // 4. Contraseña Segura (Mínimo 8 caracteres, una letra y un número)
  password: (value) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(value)
      ? null
      : "La contraseña requiere mínimo 8 caracteres, letras y números";
  },

  // 5. Validación tipo "Double" (Números con o sin decimales)
  isDouble: (value) => {
    // Acepta números como 10, 10.5, 10,50
    const regex = /^-?\d+([.,]\d+)?$/;
    if (!value) return "Debe ingresar un número";
    return regex.test(value.toString())
      ? null
      : "Debe ser un número válido (ej: 10.50)";
  },

  // 6. Solo Letras (Nombres y apellidos)
  onlyLetters: (value) => {
    const regex = /^[a-zA-ZÀ-ÿ\s]+$/;
    return regex.test(value) ? null : "Solo se permiten letras";
  },

  // 7. Teléfono (Exactamente 10 dígitos numéricos)
  phone: (value) => {
    const regex = /^\d{10}$/;
    return regex.test(value) ? null : "Deben ser exactamente 10 números";
  },

  // 8. Longitud Mínima Personalizada
  minLength: (value, min) => {
    return value.length >= min
      ? null
      : `Debe tener al menos ${min} caracteres`;
  },

  // 9. Comparar Campos (Confirmar contraseña)
  match: (value, otherValue, fieldName = "campos") => {
    return value === otherValue
      ? null
      : `Los ${fieldName} no coinciden`;
  },

  // 10. Solo Números Enteros
  onlyInteger: (value) => {
    const regex = /^\d+$/;
    return regex.test(value) ? null : "Solo se permiten números enteros";
  },

  // 11. URL válida
  url: (value) => {
    const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    return regex.test(value) ? null : "URL no válida";
  },

  domain: (value) => {
    const regex = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.[a-z]{2,12})+$/i;
    return regex.test(value) ? null : "Dominio no válido";
  }
};

/**
 * Función de utilidad para ejecutar múltiples validaciones en un solo campo
 * Uso: const error = validateAll(val, [validate.required, validate.emailFull])
 */
export const validateAll = (value, rules) => {
  for (const rule of rules) {
    const errorMessage = rule(value);
    if (errorMessage) return errorMessage;
  }
  return null;
};