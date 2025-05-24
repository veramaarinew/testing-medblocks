import React, { useState } from "react";
import { usePGlite } from "@electric-sql/pglite-react";
import toast from 'react-hot-toast';
import {
  UserPlusIcon,
  PhoneIcon,
  HomeIcon,
  IdentificationIcon,
  HeartIcon,
  UserIcon,
  DocumentCheckIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

import ProgressSteps from "./components/ProgressSteps";
import PersonalInfo from "./components/FormSteps/PersonalInfo";
import ContactInfo from "./components/FormSteps/ContactInfo";
import AddressInfo from "./components/FormSteps/AddressInfo";
import MedicalInfo from "./components/FormSteps/MedicalInfo";
import EmergencyInfo from "./components/FormSteps/EmergencyInfo";
import ReviewInfo from "./components/FormSteps/ReviewInfo";

function PatientRegistration() {
  const db = usePGlite();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    email: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    medical_record_number: "",
    allergies: "",
    pre_existing_conditions: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    registered_by: "medblocks",
  });

  const steps = [
    { id: 1, title: "Personal", icon: UserIcon },
    { id: 2, title: "Contact", icon: PhoneIcon },
    { id: 3, title: "Address", icon: HomeIcon },
    { id: 4, title: "Medical", icon: IdentificationIcon },
    { id: 5, title: "Emergency", icon: HeartIcon },
    { id: 6, title: "Review", icon: DocumentCheckIcon },
  ];

  const validatePersonalInfo = () => {
    const errors = {};
    if (!formData.first_name.trim()) errors.first_name = "First name is required";
    if (!formData.last_name.trim()) errors.last_name = "Last name is required";
    if (!formData.date_of_birth) errors.date_of_birth = "Date of birth is required";
    if (!formData.gender) errors.gender = "Gender is required";
    return errors;
  };

  const validateContactInfo = () => {
    const errors = {};
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Invalid phone number format";
    }

    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    return errors;
  };

  const validateAddressInfo = () => {
    const errors = {};
    if (!formData.street_address.trim()) errors.street_address = "Street address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.postal_code.trim()) errors.postal_code = "Postal code is required";
    return errors;
  };

  const validateMedicalInfo = () => {
    const errors = {};
    if (!formData.medical_record_number.trim()) {
      errors.medical_record_number = "Medical record number is required";
    }
    return errors;
  };

  const validateEmergencyInfo = () => {
    const errors = {};
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    if (!formData.emergency_contact_name.trim()) {
      errors.emergency_contact_name = "Emergency contact name is required";
    }
    if (!formData.emergency_contact_phone) {
      errors.emergency_contact_phone = "Emergency contact phone is required";
    } else if (!phoneRegex.test(formData.emergency_contact_phone)) {
      errors.emergency_contact_phone = "Invalid phone number format";
    }
    return errors;
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return validatePersonalInfo();
      case 2:
        return validateContactInfo();
      case 3:
        return validateAddressInfo();
      case 4:
        return validateMedicalInfo();
      case 5:
        return validateEmergencyInfo();
      default:
        return {};
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being changed
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const isStepComplete = (step) => {
    if (step === 6) return true; // Review step is always accessible once you reach it
    const stepErrors = validateStep(step);
    return Object.keys(stepErrors).length === 0;
  };

  const handleStepClick = (stepId) => {
    if (stepId <= currentStep || isStepComplete(currentStep)) {
      setCurrentStep(stepId);
    } else {
      toast.error('Please complete the current step first');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all steps before submission
    let allErrors = {};
    for (let i = 1; i <= 5; i++) {
      const stepErrors = validateStep(i);
      allErrors = { ...allErrors, ...stepErrors };
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      toast.error('Please fix all errors before submitting');
      return;
    }

    const loadingToast = toast.loading('Registering patient...');
    try {
      await db.query(
        `INSERT INTO patients (
          first_name, last_name, date_of_birth, gender, phone, email,
          street_address, city, state, postal_code, medical_record_number,
          allergies, pre_existing_conditions, emergency_contact_name,
          emergency_contact_phone, registered_by
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
        )`,
        Object.values(formData)
      );

      toast.success('Patient registered successfully!', {
        id: loadingToast,
        icon: '👍',
      });

      setFormData({
        first_name: "",
        last_name: "",
        date_of_birth: "",
        gender: "",
        phone: "",
        email: "",
        street_address: "",
        city: "",
        state: "",
        postal_code: "",
        medical_record_number: "",
        allergies: "",
        pre_existing_conditions: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        registered_by: "medblocks",
      });
      setCurrentStep(1);
      setErrors({});
    } catch (error) {
      console.error("Error registering patient:", error);
      toast.error('Failed to register patient. Please try again.', {
        id: loadingToast,
        icon: '❌',
      });
    }
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    } else {
      setErrors(stepErrors);
      toast.error('Please fix all errors before proceeding');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfo formData={formData} handleChange={handleChange} errors={errors} />;
      case 2:
        return <ContactInfo formData={formData} handleChange={handleChange} errors={errors} />;
      case 3:
        return <AddressInfo formData={formData} handleChange={handleChange} errors={errors} />;
      case 4:
        return <MedicalInfo formData={formData} handleChange={handleChange} errors={errors} />;
      case 5:
        return <EmergencyInfo formData={formData} handleChange={handleChange} errors={errors} />;
      case 6:
        return <ReviewInfo formData={formData} onEdit={setCurrentStep} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="section-title">
        <UserPlusIcon className="w-6 h-6 text-blue-600" />
        Register New Patient
      </h2>

      <ProgressSteps
        steps={steps}
        currentStep={currentStep}
        isStepComplete={isStepComplete}
        onStepClick={handleStepClick}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-section">
          {renderStepContent()}
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep - 1)}
            className={`btn-primary ${
              currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentStep === 1}
          >
            <ChevronLeftIcon className="w-5 h-5" />
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary"
            >
              Next
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="submit"
              className="btn-primary"
            >
              <UserPlusIcon className="w-5 h-5" />
              Register Patient
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default PatientRegistration;