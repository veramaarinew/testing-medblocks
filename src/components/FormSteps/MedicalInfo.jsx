import React from "react";
import { ExclamationTriangleIcon, HeartIcon } from "@heroicons/react/24/outline";

function MedicalInfo({ formData, handleChange, errors }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Medical Record Number (MRN)
        </label>
        <input
          type="text"
          name="medical_record_number"
          value={formData.medical_record_number}
          onChange={handleChange}
          className={`input-field ${errors?.medical_record_number ? 'border-red-500' : ''}`}
          required
        />
        {errors?.medical_record_number && (
          <p className="mt-1 text-sm text-red-600">{errors.medical_record_number}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
            Allergies
          </div>
        </label>
        <textarea
          name="allergies"
          value={formData.allergies}
          onChange={handleChange}
          className="input-field"
          rows="2"
          placeholder="e.g., penicillin, peanuts"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <div className="flex items-center gap-2">
            <HeartIcon className="w-5 h-5 text-red-500" />
            Pre-existing Conditions
          </div>
        </label>
        <textarea
          name="pre_existing_conditions"
          value={formData.pre_existing_conditions}
          onChange={handleChange}
          className="input-field"
          rows="2"
          placeholder="e.g., diabetes, hypertension"
        />
      </div>
    </div>
  );
}

export default MedicalInfo;