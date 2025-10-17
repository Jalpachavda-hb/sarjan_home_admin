


// utils/Validation.ts (if not already there)
export const validateEmail = (email: string): string | undefined => {
  if (!email) return undefined; // optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format";
  return undefined;
};

export const validateName = (name: string): string | undefined => {
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!name) return "Name is required";
  if (!nameRegex.test(name))
    return "Name should contain only letters and spaces";
  return undefined;
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

interface CategoryValues {
  categoryName: string;
}

interface CategoryErrors {
  categoryName?: string; // optional because it may not exist if valid
}

export const validateCategory = (values: CategoryValues): CategoryErrors => {
  const errors: CategoryErrors = {};

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
