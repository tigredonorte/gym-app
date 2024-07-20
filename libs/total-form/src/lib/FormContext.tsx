import React, { ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';

class FormProviderError extends Error {
  constructor(message = 'FormProvider not found') {
    super(message);
    this.name = 'FormProviderError';
  }
}

export interface FormErrorType {
  message: string;
  title: string;
}

export interface FormContextType<FormProps> {
  formData: FormProps;
  isFormValid: boolean;
  fieldValidity: Record<string, boolean>;
  isRequesting: boolean;
  error: FormErrorType | null;
  updateFormData: (fieldName: string, fieldValue: unknown) => void;
  updateFieldValidity: (fieldName: string, isValid: boolean) => void;
  setRequesting: (isRequesting: boolean) => void;
  setError: (error: FormErrorType | null) => void;
  clearError: () => void;
}

// Create the context with a default value
export const FormContext = createContext<FormContextType<unknown>>({
  formData: {},
  isFormValid: false,
  isRequesting: false,
  fieldValidity: {},
  error: null,
  updateFormData: () => { throw new FormProviderError(); },
  updateFieldValidity: () => { throw new FormProviderError(); },
  setRequesting: () => { throw new FormProviderError(); },
  setError: () => { throw new FormProviderError(); },
  clearError: () => { throw new FormProviderError(); },
});

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState({});
  const [fieldValidity, setFieldValidity] = useState({});
  const [isRequesting, setRequesting] = useState(false);
  const [error, setError] = useState<FormErrorType | null>(null);
  const clearError = useCallback(() => setError(null), []);

  const updateFormData = useCallback((name: string, value: unknown) => {
    setFormData((prev: Record<string, unknown>) => {
      if (prev[name] === value) {
        return prev;
      }
      const updatedData = { ...prev, [name]: value };
      return updatedData;
    });
  }, []);

  const updateFieldValidity = useCallback((name: string, isValid: boolean) => setFieldValidity((prev) => ({ ...prev, [name]: isValid })), []);
  const isFormValid = useMemo(() => Object.values(fieldValidity).every(Boolean), [fieldValidity]);

  const contextValue = useMemo(() => ({
    formData,
    isFormValid,
    fieldValidity,
    isRequesting,
    error,
    updateFormData,
    updateFieldValidity,
    setRequesting,
    setError,
    clearError,
  }), [formData, isFormValid, fieldValidity, isRequesting, error, updateFormData, updateFieldValidity, setRequesting, setError, clearError]);

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};

export function useFormContext<FormProps> () {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context as FormContextType<FormProps>;
}
