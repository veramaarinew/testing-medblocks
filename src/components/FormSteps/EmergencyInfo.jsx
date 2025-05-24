import React from "react";
import { PhoneIcon } from "@heroicons/react/24/outline";

function EmergencyInfo({ formData, handleChange }) {
  return (
    <div className="space-y-4">
      <div className="form-grid">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Emergency Contact Name
          </label>
          <input
            type="text"
            name="emergency_contact_name"
            value={formData.emergency_contact_name}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Emergency Contact Phone
          </label>
          <div className="relative">
            <input
              type="tel"
              name="emergency_contact_phone"
              value={formData.emergency_contact_phone}
              onChange={handleChange}
              className="input-field pl-10"
              required
            />
            <PhoneIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmergencyInfo;