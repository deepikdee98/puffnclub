# Form Integration Guide

This guide provides step-by-step instructions for integrating React Hook Form with Yup validation across the application.

## Table of Contents

1. [Overview](#overview)
2. [Setup and Installation](#setup-and-installation)
3. [Basic Form Implementation](#basic-form-implementation)
4. [Validation Schemas](#validation-schemas)
5. [Advanced Features](#advanced-features)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Overview

Our form management system uses:
- **React Hook Form**: For form state management and performance optimization
- **Yup**: For schema-based validation
- **@hookform/resolvers**: To integrate Yup with React Hook Form
- **React Bootstrap**: For UI components
- **React Toastify**: For user feedback

## Setup and Installation

### Required Dependencies

The following packages are already installed in the project:

```json
{
  "@hookform/resolvers": "^5.1.1",
  "react-hook-form": "^7.58.0",
  "yup": "^1.6.1",
  "react-toastify": "^11.0.5"
}
```

### Import Statements

```typescript
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
```

## Basic Form Implementation

### Step 1: Create Validation Schema

```typescript
import * as yup from 'yup';

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim()
    .lowercase(),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: yup.boolean().default(false),
});

// TypeScript interface
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}
```

### Step 2: Setup React Hook Form

```typescript
const {
  control,
  handleSubmit,
  formState: { errors, isValid, isDirty },
  reset,
  setError,
  clearErrors,
} = useForm<LoginFormData>({
  resolver: yupResolver(loginSchema),
  mode: 'onChange', // Real-time validation
  defaultValues: {
    email: '',
    password: '',
    rememberMe: false,
  },
});
```

### Step 3: Create Form Fields

```typescript
{/* Email Field */}
<Form.Group className="mb-3">
  <Form.Label>Email Address</Form.Label>
  <Controller
    name="email"
    control={control}
    render={({ field }) => (
      <Form.Control
        {...field}
        type="email"
        placeholder="Enter your email"
        isInvalid={!!errors.email}
        disabled={isLoading}
      />
    )}
  />
  {errors.email && (
    <Form.Control.Feedback type="invalid">
      {errors.email.message}
    </Form.Control.Feedback>
  )}
</Form.Group>
```

### Step 4: Handle Form Submission

```typescript
const onSubmit = async (data: LoginFormData) => {
  try {
    setIsLoading(true);
    clearErrors();
    
    // API call
    await authAPI.login(data);
    
    toast.success('Login successful!');
    router.push('/dashboard');
  } catch (error) {
    setError('root', {
      type: 'manual',
      message: 'Login failed. Please try again.',
    });
    toast.error('Login failed');
  } finally {
    setIsLoading(false);
  }
};

const onError = (errors: any) => {
  const firstError = Object.values(errors)[0] as any;
  if (firstError?.message) {
    toast.error(firstError.message);
  }
};

// In JSX
<Form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
```

## Validation Schemas

### Using Pre-built Schemas

```typescript
import { schemas } from '@/lib/validation';

// Use existing schemas
const loginForm = useForm({
  resolver: yupResolver(schemas.auth.login),
});

const productForm = useForm({
  resolver: yupResolver(schemas.product.create),
});
```

### Creating Custom Schemas

```typescript
import { baseSchemas, validationMessages } from '@/lib/validation';

const customSchema = yup.object().shape({
  // Reuse base schemas
  email: baseSchemas.email,
  
  // Custom validation
  username: yup
    .string()
    .required(validationMessages.required('Username'))
    .min(3, validationMessages.minLength('Username', 3))
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    
  // Conditional validation
  confirmEmail: yup
    .string()
    .when('email', (email, schema) => 
      email ? schema.required('Please confirm your email').oneOf([email], 'Emails must match') : schema
    ),
});
```

## Advanced Features

### Using the Custom Hook

```typescript
import { useFormValidation } from '@/hooks/useFormValidation';

const MyComponent = () => {
  const { control, onSubmit, formState: { errors } } = useFormValidation({
    schema: loginSchema,
    onSubmit: async (data) => {
      await authAPI.login(data);
      toast.success('Success!');
    },
    showToastOnError: true,
    resetOnSuccess: false,
  });

  return (
    <Form onSubmit={onSubmit}>
      {/* Form fields */}
    </Form>
  );
};
```

### Multi-Step Forms

```typescript
import { useMultiStepForm } from '@/hooks/useFormValidation';

const schemas = [
  yup.object().shape({ step1Field: yup.string().required() }),
  yup.object().shape({ step2Field: yup.string().required() }),
  yup.object().shape({ step3Field: yup.string().required() }),
];

const MultiStepComponent = () => {
  const {
    control,
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    formState: { errors, isValid },
  } = useMultiStepForm(schemas);

  return (
    <div>
      <div>Step {currentStep + 1} of {totalSteps}</div>
      
      {/* Render current step fields */}
      
      <div>
        {!isFirstStep && (
          <Button onClick={prevStep}>Previous</Button>
        )}
        {!isLastStep && (
          <Button onClick={nextStep} disabled={!isValid}>Next</Button>
        )}
        {isLastStep && (
          <Button type="submit">Submit</Button>
        )}
      </div>
    </div>
  );
};
```

### File Upload Validation

```typescript
const fileSchema = yup.object().shape({
  avatar: yup
    .mixed()
    .required('Please select a file')
    .test('fileSize', 'File size must be less than 5MB', (value) => {
      return value && value[0] && value[0].size <= 5 * 1024 * 1024;
    })
    .test('fileType', 'Only image files are allowed', (value) => {
      return value && value[0] && ['image/jpeg', 'image/png', 'image/gif'].includes(value[0].type);
    }),
});
```

### Dynamic Field Arrays

```typescript
import { useFieldArray } from 'react-hook-form';

const ProductVariantsForm = () => {
  const { control } = useForm({
    defaultValues: {
      variants: [{ size: '', color: '', price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id}>
          <Controller
            name={`variants.${index}.size`}
            control={control}
            render={({ field }) => (
              <Form.Control {...field} placeholder="Size" />
            )}
          />
          <Button onClick={() => remove(index)}>Remove</Button>
        </div>
      ))}
      <Button onClick={() => append({ size: '', color: '', price: 0 })}>
        Add Variant
      </Button>
    </div>
  );
};
```

## Best Practices

### 1. Form Organization

```typescript
// ✅ Good: Separate concerns
const useLoginForm = () => {
  return useFormValidation({
    schema: schemas.auth.login,
    onSubmit: async (data) => {
      await authAPI.login(data);
    },
  });
};

const LoginForm = () => {
  const { control, onSubmit, formState } = useLoginForm();
  // Render form
};
```

### 2. Error Handling

```typescript
// ✅ Good: Comprehensive error handling
const onSubmit = async (data) => {
  try {
    await api.submit(data);
  } catch (error) {
    if (error.status === 422) {
      // Handle validation errors
      Object.entries(error.data.errors).forEach(([field, message]) => {
        setError(field, { message });
      });
    } else {
      // Handle general errors
      setError('root', { message: error.message });
    }
  }
};
```

### 3. Performance Optimization

```typescript
// ✅ Good: Use mode appropriately
const form = useForm({
  mode: 'onChange', // For real-time validation
  // mode: 'onBlur', // For less frequent validation
  // mode: 'onSubmit', // For validation only on submit
});
```

### 4. Accessibility

```typescript
// ✅ Good: Proper accessibility attributes
<Form.Control
  {...field}
  aria-describedby={errors.email ? 'email-error' : undefined}
  aria-invalid={!!errors.email}
/>
{errors.email && (
  <div id="email-error" role="alert">
    {errors.email.message}
  </div>
)}
```

## Troubleshooting

### Common Issues

#### 1. "Cannot read property 'message' of undefined"

**Problem**: Accessing error message when error doesn't exist.

**Solution**:
```typescript
// ❌ Bad
{errors.email.message}

// ✅ Good
{errors.email?.message}
{errors.email && <div>{errors.email.message}</div>}
```

#### 2. Form not re-rendering on validation

**Problem**: Form state not updating properly.

**Solution**:
```typescript
// Ensure you're using the correct mode
const form = useForm({
  mode: 'onChange', // or 'onBlur'
});

// Check if you're using Controller correctly
<Controller
  name="email"
  control={control} // Make sure control is passed
  render={({ field }) => <Form.Control {...field} />}
/>
```

#### 3. Default values not working

**Problem**: Form fields not showing default values.

**Solution**:
```typescript
// ✅ Set default values in useForm
const form = useForm({
  defaultValues: {
    email: '',
    password: '',
  },
});

// ✅ Or use reset() to set values later
useEffect(() => {
  reset({
    email: user.email,
    password: '',
  });
}, [user, reset]);
```

#### 4. Validation not triggering

**Problem**: Yup validation not working.

**Solution**:
```typescript
// ✅ Ensure resolver is properly configured
const form = useForm({
  resolver: yupResolver(schema), // Make sure schema is valid
});

// ✅ Check schema syntax
const schema = yup.object().shape({ // Use .shape()
  email: yup.string().required(),
});
```

#### 5. TypeScript errors

**Problem**: Type mismatches with form data.

**Solution**:
```typescript
// ✅ Define proper interfaces
interface FormData {
  email: string;
  password: string;
}

// ✅ Use generic types
const form = useForm<FormData>({
  resolver: yupResolver(schema),
});

// ✅ Ensure schema matches interface
const schema: yup.ObjectSchema<FormData> = yup.object().shape({
  email: yup.string().required(),
  password: yup.string().required(),
});
```

### Debugging Tips

1. **Console log form state**:
```typescript
console.log('Form state:', formState);
console.log('Errors:', errors);
console.log('Values:', watch());
```

2. **Use React DevTools**: Install React Hook Form DevTools for debugging.

3. **Validate schema separately**:
```typescript
try {
  await schema.validate(data);
  console.log('Schema validation passed');
} catch (error) {
  console.log('Schema validation failed:', error);
}
```

4. **Check network requests**: Ensure API endpoints are working correctly.

5. **Verify dependencies**: Make sure all required packages are installed and up to date.

## Migration from Existing Forms

### From Basic React Forms

```typescript
// ❌ Before: Basic React state
const [email, setEmail] = useState('');
const [errors, setErrors] = useState({});

const handleSubmit = (e) => {
  e.preventDefault();
  // Manual validation
  if (!email) {
    setErrors({ email: 'Email is required' });
    return;
  }
  // Submit logic
};

// ✅ After: React Hook Form
const { control, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(schema),
});

const onSubmit = (data) => {
  // Submit logic - validation handled automatically
};
```

### From Formik

```typescript
// ❌ Before: Formik
import { Formik, Form, Field } from 'formik';

<Formik
  initialValues={{ email: '' }}
  validationSchema={schema}
  onSubmit={onSubmit}
>
  {({ errors, touched }) => (
    <Form>
      <Field name="email" />
      {errors.email && touched.email && <div>{errors.email}</div>}
    </Form>
  )}
</Formik>

// ✅ After: React Hook Form
const { control, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(schema),
  defaultValues: { email: '' },
});

<Form onSubmit={handleSubmit(onSubmit)}>
  <Controller
    name="email"
    control={control}
    render={({ field }) => <Form.Control {...field} />}
  />
  {errors.email && <div>{errors.email.message}</div>}
</Form>
```

This guide provides a comprehensive foundation for implementing forms across the application. For specific use cases or additional features, refer to the React Hook Form and Yup documentation.