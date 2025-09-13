'use client';

import { useState } from 'react';
import { useForm, UseFormProps, FieldValues, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import * as yup from 'yup';

interface UseFormValidationOptions<T extends FieldValues> extends Omit<UseFormProps<T>, 'resolver'> {
  schema: yup.ObjectSchema<any>;
  onSubmit?: (data: T) => Promise<void> | void;
  onError?: (errors: any) => void;
  showToastOnError?: boolean;
  resetOnSuccess?: boolean;
}

interface UseFormValidationReturn<T extends FieldValues> extends UseFormReturn<T> {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
}

export function useFormValidation<T extends FieldValues = FieldValues>({
  schema,
  onSubmit,
  onError,
  showToastOnError = true,
  resetOnSuccess = false,
  mode = 'onChange',
  ...formOptions
}: UseFormValidationOptions<T>): UseFormValidationReturn<T> {
  const form = useForm<T>({
    resolver: yupResolver(schema),
    mode,
    ...formOptions,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setError,
    clearErrors,
  } = form;

  const handleFormSubmit = handleSubmit(
    async (data: T) => {
      try {
        clearErrors();
        
        if (onSubmit) {
          await onSubmit(data);
          
          if (resetOnSuccess) {
            reset();
          }
        }
      } catch (error) {
        console.error('Form submission error:', error);
        
        // Handle different types of errors
        if (error instanceof Error) {
          setError('root', {
            type: 'manual',
            message: error.message,
          });
          
          if (showToastOnError) {
            toast.error(error.message);
          }
        } else if (typeof error === 'object' && error !== null) {
          // Handle validation errors from API
          const apiError = error as any;
          
          if (apiError.errors && typeof apiError.errors === 'object') {
            // Set field-specific errors
            Object.entries(apiError.errors).forEach(([field, message]) => {
              setError(field as any, {
                type: 'manual',
                message: message as string,
              });
            });
          } else if (apiError.message) {
            setError('root', {
              type: 'manual',
              message: apiError.message,
            });
            
            if (showToastOnError) {
              toast.error(apiError.message);
            }
          }
        } else {
          const defaultMessage = 'An unexpected error occurred';
          setError('root', {
            type: 'manual',
            message: defaultMessage,
          });
          
          if (showToastOnError) {
            toast.error(defaultMessage);
          }
        }
      }
    },
    (errors) => {
      console.error('Form validation errors:', errors);
      
      if (onError) {
        onError(errors);
      }
      
      if (showToastOnError) {
        // Show first validation error as toast
        const firstError = Object.values(errors)[0] as any;
        if (firstError?.message) {
          toast.error(firstError.message);
        }
      }
    }
  );

  return {
    ...form,
    onSubmit: handleFormSubmit,
    isSubmitting,
  };
}

// Utility hook for simple form validation without submission
export function useFormValidationOnly<T extends FieldValues = FieldValues>(
  schema: yup.ObjectSchema<any>,
  options?: Omit<UseFormProps<T>, 'resolver'>
): UseFormReturn<T> {
  return useForm<T>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    ...options,
  });
}

// Hook for multi-step forms
export function useMultiStepForm<T extends FieldValues = FieldValues>(
  schemas: yup.ObjectSchema<any>[],
  options?: Omit<UseFormProps<T>, 'resolver'>
) {
  const [currentStep, setCurrentStep] = useState(0);
  const currentSchema = schemas[currentStep];
  
  const form = useForm<T>({
    resolver: yupResolver(currentSchema),
    mode: 'onChange',
    ...options,
  });

  const nextStep = () => {
    if (currentStep < schemas.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < schemas.length) {
      setCurrentStep(step);
    }
  };

  return {
    ...form,
    currentStep,
    totalSteps: schemas.length,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === schemas.length - 1,
    nextStep,
    prevStep,
    goToStep,
  };
}

export default useFormValidation;