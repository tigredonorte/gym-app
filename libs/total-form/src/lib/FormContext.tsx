import React, { ReactNode, createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

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
  unwatchFieldChanges: (fieldName: string, callback: (fieldValue: unknown) => void) => void;
  watchFieldChanges: (fieldName: string, callback: (fieldValue: unknown) => void) => void;
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
  unwatchFieldChanges: () => { throw new FormProviderError(); },
  watchFieldChanges: () => { throw new FormProviderError(); },
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
  const fieldWatchers = useRef(new Map<string, Set<(fieldValue: unknown) => void>>());
  const clearError = useCallback(() => setError(null), []);

  const emitFieldChange = useCallback((fieldName: string, value: unknown) => {
    const watchers = fieldWatchers.current.get(fieldName);
    if (!watchers) {
      return;
    }
    watchers.forEach((callback) => {
      try {
        callback(value);
      } catch (error) {
        console.error(error);
      }
    });
  }, []);

  const updateFormData = useCallback((name: string, value: unknown) => {
    setFormData((prev: Record<string, unknown>) => {
      const updatedData = { ...prev, [name]: value };
      emitFieldChange(name, value);
      return updatedData;
    });
  }, [emitFieldChange]);

  const watchFieldChanges = useCallback((fieldName: string, callback: (fieldValue: unknown) => void): void => {
    if (!fieldWatchers.current.has(fieldName)) {
      fieldWatchers.current.set(fieldName, new Set());
    }

    const watchers = fieldWatchers.current.get(fieldName);
    if (watchers?.has(callback)) {
      return;
    }
    watchers?.add(callback);
  }, []);

  const unwatchFieldChanges = useCallback((fieldName: string, callback: (fieldValue: unknown) => void) => {
    const watchers = fieldWatchers.current.get(fieldName);
    if (!watchers) {
      return;
    }
    watchers.delete(callback);
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
    watchFieldChanges,
    unwatchFieldChanges
  }), [
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
    watchFieldChanges,
    unwatchFieldChanges
  ]);

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
