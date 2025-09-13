// Re-export validation schemas and utilities
export * from './schemas';
export { default as schemas } from './schemas';

// Form validation utilities
export const getFieldError = (errors: any, fieldName: string): string | undefined => {
  return errors[fieldName]?.message;
};

export const hasFieldError = (errors: any, fieldName: string): boolean => {
  return !!errors[fieldName];
};

export const getNestedFieldError = (errors: any, path: string): string | undefined => {
  const keys = path.split('.');
  let current = errors;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  
  return current?.message;
};

// Form state utilities
export const isFormValid = (errors: any): boolean => {
  return Object.keys(errors).length === 0;
};

export const getFirstError = (errors: any): string | undefined => {
  const firstError = Object.values(errors)[0] as any;
  return firstError?.message;
};

// Custom validation functions
export const createConditionalSchema = (condition: boolean, schema: any, fallback: any = undefined) => {
  return condition ? schema : fallback;
};

export const createDependentValidation = (dependentField: string, validation: any) => {
  return (value: any, context: any) => {
    const dependentValue = context.parent[dependentField];
    return dependentValue ? validation : true;
  };
};