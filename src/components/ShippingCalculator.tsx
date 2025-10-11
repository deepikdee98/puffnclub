import React, { useState, useEffect } from 'react';

interface ShippingOption {
  courierId: string;
  courierName: string;
  rate: number;
  estimatedDeliveryDays: string;
  description: string;
  codAvailable: boolean;
}

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  weight?: number;
}

interface ShippingCalculatorProps {
  cartItems: CartItem[];
  onShippingSelect: (option: ShippingOption) => void;
  selectedPincode?: string;
}

const ShippingCalculator: React.FC<ShippingCalculatorProps> = ({
  cartItems,
  onShippingSelect,
  selectedPincode
}) => {
  const [pincode, setPincode] = useState(selectedPincode || '');
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<ShippingOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serviceable, setServiceable] = useState<boolean | null>(null);

  // Check serviceability when pincode changes
  useEffect(() => {
    if (pincode.length === 6) {
      checkServiceability();
    }
  }, [pincode]);

  const checkServiceability = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/website/shipping/serviceability/${pincode}`);
      const data = await response.json();
      
      if (data.success) {
        setServiceable(data.serviceable);
        if (data.serviceable) {
          await getShippingRates();
        } else {
          setShippingOptions([]);
          setError('Delivery not available to this pincode');
        }
      } else {
        setError('Failed to check serviceability');
      }
    } catch (err) {
      setError('Failed to check serviceability');
      console.error('Serviceability check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getShippingRates = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/website/shipping/rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deliveryPincode: pincode,
          items: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            weight: item.weight || 0.5
          }))
        })
      });

      const data = await response.json();

      if (data.success) {
        setShippingOptions(data.shippingOptions);
        // Auto-select the cheapest option
        if (data.shippingOptions.length > 0) {
          const cheapest = data.shippingOptions.reduce((prev: ShippingOption, current: ShippingOption) => 
            prev.rate < current.rate ? prev : current
          );
          setSelectedOption(cheapest);
          onShippingSelect(cheapest);
        }
      } else {
        setError(data.error || 'Failed to get shipping rates');
        setShippingOptions([]);
      }
    } catch (err) {
      setError('Failed to get shipping rates');
      console.error('Shipping rates error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option: ShippingOption) => {
    setSelectedOption(option);
    onShippingSelect(option);
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(value);
    
    if (value.length < 6) {
      setServiceable(null);
      setShippingOptions([]);
      setSelectedOption(null);
    }
  };

  return (
    <div className="shipping-calculator">
      <h3 className="text-lg font-semibold mb-4">Shipping Options</h3>
      
      {/* Pincode Input */}
      <div className="mb-4">
        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
          Enter Delivery Pincode
        </label>
        <input
          type="text"
          id="pincode"
          value={pincode}
          onChange={handlePincodeChange}
          placeholder="Enter 6-digit pincode"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={6}
        />
        {pincode.length > 0 && pincode.length < 6 && (
          <p className="text-sm text-gray-500 mt-1">Please enter a 6-digit pincode</p>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-600">Checking delivery options...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Serviceability Status */}
      {serviceable === false && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
          <p className="text-sm text-yellow-800">
            Sorry, delivery is not available to this pincode.
          </p>
        </div>
      )}

      {/* Shipping Options */}
      {shippingOptions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Available Shipping Options:</h4>
          {shippingOptions.map((option) => (
            <div
              key={option.courierId}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedOption?.courierId === option.courierId
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="shipping"
                    checked={selectedOption?.courierId === option.courierId}
                    onChange={() => handleOptionSelect(option)}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{option.courierName}</p>
                    <p className="text-sm text-gray-600">
                      Estimated delivery: {option.estimatedDeliveryDays} days
                    </p>
                    {option.codAvailable && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
                        COD Available
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">₹{option.rate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Option Summary */}
      {selectedOption && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-3">
          <p className="text-sm text-green-800">
            <strong>Selected:</strong> {selectedOption.courierName} - ₹{selectedOption.rate}
            <br />
            <strong>Delivery:</strong> {selectedOption.estimatedDeliveryDays} days
          </p>
        </div>
      )}
    </div>
  );
};

export default ShippingCalculator;