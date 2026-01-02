'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { cardSchema, CardFormData } from '../schemas/validationSchemas';

interface CardPaymentProps {
  isExpanded: boolean;
  onSubmit: (data: CardFormData) => void;
}

export default function CardPayment({ isExpanded, onSubmit }: CardPaymentProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CardFormData>({
    resolver: yupResolver(cardSchema),
    defaultValues: {
      saveCard: false,
    },
  });

  const formatCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length > 16) value = value.substring(0, 16);
    e.target.value = value;
  };

  const formatExpiryDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
  };

  if (!isExpanded) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-3 pt-0">
      {/* Card Number */}
      <div className="mb-3">
        <label htmlFor="cardNumber" className="form-label text-muted small">
          Card Number
        </label>
        <input
          {...register('cardNumber')}
          id="cardNumber"
          type="text"
          maxLength={16}
          onInput={formatCardNumber}
          className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
          style={{ backgroundColor: '#f5f5f5', border: 'none' }}
        />
        {errors.cardNumber && (
          <div className="invalid-feedback">{errors.cardNumber.message}</div>
        )}
      </div>

      {/* Card Name */}
      <div className="mb-3">
        <label htmlFor="cardName" className="form-label text-muted small">
          Card Name
        </label>
        <input
          {...register('cardName')}
          id="cardName"
          type="text"
          className={`form-control ${errors.cardName ? 'is-invalid' : ''}`}
          style={{ backgroundColor: '#f5f5f5', border: 'none' }}
        />
        {errors.cardName && (
          <div className="invalid-feedback">{errors.cardName.message}</div>
        )}
      </div>

      {/* Expiry Date and CVV */}
      <div className="row mb-3">
        <div className="col-6">
          <label htmlFor="expiryDate" className="form-label text-muted small">
            Expiry Date
          </label>
          <input
            {...register('expiryDate')}
            id="expiryDate"
            type="text"
            maxLength={5}
            onInput={formatExpiryDate}
            className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
            style={{ backgroundColor: '#f5f5f5', border: 'none' }}
          />
          {errors.expiryDate && (
            <div className="invalid-feedback">{errors.expiryDate.message}</div>
          )}
        </div>
        <div className="col-6">
          <label htmlFor="cvv" className="form-label text-muted small">
            CVV
          </label>
          <input
            {...register('cvv')}
            id="cvv"
            type="password"
            maxLength={4}
            className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
            style={{ backgroundColor: '#f5f5f5', border: 'none' }}
          />
          {errors.cvv && (
            <div className="invalid-feedback">{errors.cvv.message}</div>
          )}
        </div>
      </div>

      {/* Save Card Checkbox */}
      <div className="form-check mb-3">
        <input
          {...register('saveCard')}
          type="checkbox"
          className="form-check-input"
          id="saveCard"
        />
        <label className="form-check-label" htmlFor="saveCard">
          Save the card details
        </label>
      </div>

      <button type="submit" className="btn btn-dark w-100">
        Pay Now
      </button>
    </form>
  );
}
