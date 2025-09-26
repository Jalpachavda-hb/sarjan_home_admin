


export const validateEmail = (value: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return "Invalid email format";
  }
  return null;
};

export const validateContact = (value: string): string | null => {
  if (!/^\d*$/.test(value)) { // only digits allowed
    return "Only numbers are allowed";
  }
  if (value.length > 0 && value.length !== 10) { // must be exactly 10 digits
    return "Contact number must be exactly 10 digits";
  }
  return null; // valid
};
export const validatePassword = (value: string): string | null => {
  if (!value.trim()) return "Password is required";
  return null; // ✅ only required, no length check
};


export const validateCategory = (values) => {
  const errors = {};

  if (!values.categoryName || values.categoryName.trim() === "") {
    errors.categoryName = "Category name is required";
  }

  return errors;
};


export const validateRequiredforselcet = (value: string, fieldName: string): string => {
  if (!value || value.trim() === "") {
    return `${fieldName} is required`;
  }
  return "";
};
