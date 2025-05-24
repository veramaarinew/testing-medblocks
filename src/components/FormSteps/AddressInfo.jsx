import React from "react";
import { HomeIcon } from "@heroicons/react/24/outline";

function AddressInfo({ formData, handleChange, errors }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Street Address
        </label>
        <input
          type="text"
          name="street_address"
          value={formData.street_address}
          onChange={handleChange}
          className={`input-field ${errors?.street_address ? 'border-red-500' : ''}`}
          required
        />
        {errors?.street_address && (
          <p className="mt-1 text-sm text-red-600">{errors.street_address}</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`input-field ${errors?.city ? 'border-red-500' : ''}`}
            required
          />
          {errors?.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={`input-field ${errors?.state ? 'border-red-500' : ''}`}
            required
          />
          {errors?.state && (
            <p className="mt-1 text-sm text-red-600">{errors.state}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Postal Code
          </label>
          <input
            type="text"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            className={`input-field ${errors?.postal_code ? 'border-red-500' : ''}`}
            required
          />
          {errors?.postal_code && (
            <p className="mt-1 text-sm text-red-600">{errors.postal_code}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddressInfo;