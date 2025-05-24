import React from "react";
import { PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

function ContactInfo({ formData, handleChange, errors }) {
  return (
    <div className="space-y-4">
      <div className="form-grid">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`input-field pl-10 ${errors?.phone ? 'border-red-500' : ''}`}
              required
            />
            <PhoneIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          {errors?.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input-field pl-10 ${errors?.email ? 'border-red-500' : ''}`}
            />
            <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          {errors?.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;