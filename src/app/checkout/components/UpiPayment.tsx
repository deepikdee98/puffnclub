'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { upiSchema, UpiFormData } from '../schemas/validationSchemas';
import { FiArrowRight } from 'react-icons/fi';

interface UpiPaymentProps {
  isExpanded: boolean;
  onSubmit: (data: UpiFormData) => void;
}

export default function UpiPayment({ isExpanded, onSubmit }: UpiPaymentProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpiFormData>({
    resolver: yupResolver(upiSchema),
  });

  if (!isExpanded) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-3 pt-0">
      <div className="mb-3">
        <label htmlFor="upiId" className="form-label text-muted small">
          Enter UPI ID
        </label>
        <div className="position-relative">
          <input
            {...register('upiId')}
            id="upiId"
            type="text"
            className={`form-control ${errors.upiId ? 'is-invalid' : ''}`}
            style={{
              backgroundColor: '#f5f5f5',
              border: 'none',
              paddingRight: '50px',
            }}
          />
          <button
            type="submit"
            className="btn btn-dark position-absolute end-0 top-0 h-100 d-flex align-items-center justify-content-center"
            style={{ width: '50px', borderRadius: '0 0.375rem 0.375rem 0' }}
          >
            <FiArrowRight />
          </button>
        </div>
        {errors.upiId && (
          <div className="invalid-feedback d-block">
            {errors.upiId.message}
          </div>
        )}
      </div>
    </form>
  );
}
