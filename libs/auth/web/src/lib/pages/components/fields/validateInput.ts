
export const isEmailValid = (email: string) => !(/\S+@\S+\.\S+/.test(email)) ? 'Invalid email' : null; 
export const isPasswordValid = (password: string) => {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  return null;
};
export const isNameValid = (name: string) => {
  if (name.length < 3) return 'Name must be at least 3 characters';
  if (name.length > 30) return 'Name must be less than 30 characters';
  return null;
};
export const validate = {
  email: isEmailValid,
  password: isPasswordValid,
  name: isNameValid,
}