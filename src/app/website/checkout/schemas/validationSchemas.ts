import * as yup from 'yup';

// UPI validation schema
export const upiSchema = yup.object().shape({
  upiId: yup
    .string()
    .required('UPI ID is required')
    .matches(
      /^[\w.-]+@[\w.-]+$/,
      'Please enter a valid UPI ID (e.g., 9876543210@ybl)'
    ),
});

// Card payment validation schema
export const cardSchema = yup.object().shape({
  cardNumber: yup
    .string()
    .required('Card number is required')
    .matches(/^[0-9]{16}$/, 'Card number must be 16 digits')
    .test('luhn-check', 'Invalid card number', (value) => {
      if (!value) return false;

      // Luhn algorithm for card validation
      let sum = 0;
      let isEven = false;

      for (let i = value.length - 1; i >= 0; i--) {
        let digit = parseInt(value.charAt(i));

        if (isEven) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }

        sum += digit;
        isEven = !isEven;
      }

      return sum % 10 === 0;
    }),
  cardName: yup
    .string()
    .required('Cardholder name is required')
    .min(3, 'Name must be at least 3 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters'),
  expiryDate: yup
    .string()
    .required('Expiry date is required')
    .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Format must be MM/YY')
    .test('expiry-valid', 'Card has expired', (value) => {
      if (!value) return false;
      const [month, year] = value.split('/');
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const today = new Date();
      return expiryDate >= today;
    }),
  cvv: yup
    .string()
    .required('CVV is required')
    .matches(/^[0-9]{3,4}$/, 'CVV must be 3 or 4 digits'),
  saveCard: yup.boolean(),
});

export type UpiFormData = yup.InferType<typeof upiSchema>;
export type CardFormData = yup.InferType<typeof cardSchema>;
