import * as yup from 'yup';

// Common validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
};

// Common validation messages
export const validationMessages = {
  required: (field: string) => `${field} is required`,
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  password: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number',
  minLength: (field: string, min: number) => `${field} must be at least ${min} characters`,
  maxLength: (field: string, max: number) => `${field} must not exceed ${max} characters`,
  match: (field: string) => `${field} do not match`,
  positive: (field: string) => `${field} must be a positive number`,
  integer: (field: string) => `${field} must be a whole number`,
  url: 'Please enter a valid URL',
  date: 'Please enter a valid date',
};

// Base field schemas for reuse
export const baseSchemas = {
  email: yup
    .string()
    .required(validationMessages.required('Email'))
    .email(validationMessages.email)
    .trim()
    .lowercase(),
    
  password: yup
    .string()
    .required(validationMessages.required('Password'))
    .min(6, validationMessages.minLength('Password', 6))
    .max(50, validationMessages.maxLength('Password', 50)),
    
  strongPassword: yup
    .string()
    .required(validationMessages.required('Password'))
    .min(8, validationMessages.minLength('Password', 8))
    .matches(validationPatterns.password, validationMessages.password),
    
  name: yup
    .string()
    .required(validationMessages.required('Name'))
    .min(2, validationMessages.minLength('Name', 2))
    .max(50, validationMessages.maxLength('Name', 50))
    .trim(),
    
  phone: yup
    .string()
    .matches(validationPatterns.phone, validationMessages.phone)
    .min(10, validationMessages.minLength('Phone number', 10)),
    
  url: yup
    .string()
    .url(validationMessages.url),
    
  price: yup
    .number()
    .positive(validationMessages.positive('Price'))
    .required(validationMessages.required('Price')),
    
  quantity: yup
    .number()
    .integer(validationMessages.integer('Quantity'))
    .min(0, 'Quantity cannot be negative')
    .required(validationMessages.required('Quantity')),
};

// Authentication schemas
export const authSchemas = {
  login: yup.object().shape({
    email: baseSchemas.email,
    password: baseSchemas.password,
    rememberMe: yup.boolean().default(false),
  }),
  
  register: yup.object().shape({
    firstName: baseSchemas.name,
    lastName: baseSchemas.name,
    email: baseSchemas.email,
    password: baseSchemas.strongPassword,
    confirmPassword: yup
      .string()
      .required(validationMessages.required('Confirm Password'))
      .oneOf([yup.ref('password')], validationMessages.match('Passwords')),
    terms: yup
      .boolean()
      .oneOf([true], 'You must accept the terms and conditions'),
  }),
  
  forgotPassword: yup.object().shape({
    email: baseSchemas.email,
  }),
  
  resetPassword: yup.object().shape({
    password: baseSchemas.strongPassword,
    confirmPassword: yup
      .string()
      .required(validationMessages.required('Confirm Password'))
      .oneOf([yup.ref('password')], validationMessages.match('Passwords')),
  }),
  
  changePassword: yup.object().shape({
    currentPassword: baseSchemas.password,
    newPassword: baseSchemas.strongPassword,
    confirmPassword: yup
      .string()
      .required(validationMessages.required('Confirm Password'))
      .oneOf([yup.ref('newPassword')], validationMessages.match('Passwords')),
  }),
};

// Product schemas
export const productSchemas = {
  create: yup.object().shape({
    name: yup
      .string()
      .required(validationMessages.required('Product name'))
      .min(3, validationMessages.minLength('Product name', 3))
      .max(100, validationMessages.maxLength('Product name', 100))
      .trim(),
    description: yup
      .string()
      .required(validationMessages.required('Description'))
      .min(10, validationMessages.minLength('Description', 10))
      .max(1000, validationMessages.maxLength('Description', 1000)),
    sku: yup
      .string()
      .required(validationMessages.required('SKU'))
      .matches(validationPatterns.alphanumeric, 'SKU must contain only letters and numbers')
      .min(3, validationMessages.minLength('SKU', 3))
      .max(20, validationMessages.maxLength('SKU', 20))
      .uppercase(),
    price: baseSchemas.price,
    comparePrice: yup
      .number()
      .positive(validationMessages.positive('Compare price'))
      .when('price', (price, schema) => 
        price ? schema.min(price, 'Compare price must be higher than regular price') : schema
      ),
    inventory: baseSchemas.quantity,
    categoryId: yup
      .string()
      .required(validationMessages.required('Category')),
    brandId: yup
      .string()
      .required(validationMessages.required('Brand')),
    status: yup
      .string()
      .oneOf(['active', 'inactive', 'draft'], 'Invalid status')
      .default('draft'),
    featured: yup.boolean().default(false),
    seo: yup.object().shape({
      title: yup
        .string()
        .max(60, validationMessages.maxLength('SEO title', 60)),
      description: yup
        .string()
        .max(160, validationMessages.maxLength('SEO description', 160)),
      keywords: yup
        .array()
        .of(yup.string())
        .max(10, 'Maximum 10 keywords allowed'),
    }),
  }),
};

// Category schemas
export const categorySchemas = {
  create: yup.object().shape({
    name: yup
      .string()
      .required(validationMessages.required('Category name'))
      .min(2, validationMessages.minLength('Category name', 2))
      .max(50, validationMessages.maxLength('Category name', 50))
      .trim(),
    slug: yup
      .string()
      .matches(validationPatterns.slug, 'Slug must be lowercase with hyphens only')
      .min(2, validationMessages.minLength('Slug', 2))
      .max(50, validationMessages.maxLength('Slug', 50)),
    description: yup
      .string()
      .max(500, validationMessages.maxLength('Description', 500)),
    parentId: yup.string().nullable(),
    isActive: yup.boolean().default(true),
    order: yup
      .number()
      .integer(validationMessages.integer('Order'))
      .min(0, 'Order cannot be negative')
      .default(0),
  }),
};

// Order schemas
export const orderSchemas = {
  updateStatus: yup.object().shape({
    status: yup
      .string()
      .oneOf(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
      .required(validationMessages.required('Status')),
    note: yup
      .string()
      .max(500, validationMessages.maxLength('Note', 500)),
  }),
  
  addNote: yup.object().shape({
    note: yup
      .string()
      .required(validationMessages.required('Note'))
      .min(5, validationMessages.minLength('Note', 5))
      .max(500, validationMessages.maxLength('Note', 500)),
  }),
  
  processRefund: yup.object().shape({
    amount: yup
      .number()
      .positive(validationMessages.positive('Refund amount'))
      .required(validationMessages.required('Refund amount')),
    reason: yup
      .string()
      .required(validationMessages.required('Refund reason'))
      .min(10, validationMessages.minLength('Refund reason', 10))
      .max(200, validationMessages.maxLength('Refund reason', 200)),
  }),
};

// User/Customer schemas
export const userSchemas = {
  profile: yup.object().shape({
    firstName: baseSchemas.name,
    lastName: baseSchemas.name,
    email: baseSchemas.email,
    phone: baseSchemas.phone.optional(),
    avatar: baseSchemas.url.optional(),
  }),
  
  address: yup.object().shape({
    type: yup
      .string()
      .oneOf(['billing', 'shipping'])
      .required(validationMessages.required('Address type')),
    firstName: baseSchemas.name,
    lastName: baseSchemas.name,
    company: yup
      .string()
      .max(100, validationMessages.maxLength('Company', 100)),
    address1: yup
      .string()
      .required(validationMessages.required('Address'))
      .max(100, validationMessages.maxLength('Address', 100)),
    address2: yup
      .string()
      .max(100, validationMessages.maxLength('Address line 2', 100)),
    city: yup
      .string()
      .required(validationMessages.required('City'))
      .max(50, validationMessages.maxLength('City', 50)),
    state: yup
      .string()
      .required(validationMessages.required('State'))
      .max(50, validationMessages.maxLength('State', 50)),
    zipCode: yup
      .string()
      .required(validationMessages.required('ZIP code'))
      .matches(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),
    country: yup
      .string()
      .required(validationMessages.required('Country'))
      .max(50, validationMessages.maxLength('Country', 50)),
    phone: baseSchemas.phone.optional(),
    isDefault: yup.boolean().default(false),
  }),
};

// Settings schemas
export const settingsSchemas = {
  general: yup.object().shape({
    siteName: yup
      .string()
      .required(validationMessages.required('Site name'))
      .max(100, validationMessages.maxLength('Site name', 100)),
    siteDescription: yup
      .string()
      .max(500, validationMessages.maxLength('Site description', 500)),
    contactEmail: baseSchemas.email,
    supportEmail: baseSchemas.email,
    phone: baseSchemas.phone.optional(),
    address: yup
      .string()
      .max(200, validationMessages.maxLength('Address', 200)),
    timezone: yup
      .string()
      .required(validationMessages.required('Timezone')),
    currency: yup
      .string()
      .required(validationMessages.required('Currency'))
      .length(3, 'Currency code must be 3 characters'),
  }),
  
  shipping: yup.object().shape({
    freeShippingThreshold: yup
      .number()
      .min(0, 'Free shipping threshold cannot be negative')
      .required(validationMessages.required('Free shipping threshold')),
    standardShippingRate: baseSchemas.price,
    expressShippingRate: baseSchemas.price,
    internationalShippingRate: baseSchemas.price,
  }),
  
  tax: yup.object().shape({
    taxRate: yup
      .number()
      .min(0, 'Tax rate cannot be negative')
      .max(100, 'Tax rate cannot exceed 100%')
      .required(validationMessages.required('Tax rate')),
    taxIncluded: yup.boolean().default(false),
  }),
};

export default {
  auth: authSchemas,
  product: productSchemas,
  category: categorySchemas,
  order: orderSchemas,
  user: userSchemas,
  settings: settingsSchemas,
  base: baseSchemas,
  patterns: validationPatterns,
  messages: validationMessages,
};