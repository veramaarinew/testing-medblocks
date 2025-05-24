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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isStepComplete = (step) => {
    switch (step) {
      case 1:
        return formData.first_name && formData.last_name && formData.date_of_birth && formData.gender;
      case 2:
        return formData.phone;
      case 3:
        return formData.street_address && formData.city && formData.state && formData.postal_code;
      case 4:
        return formData.medical_record_number;
      case 5:
        return formData.emergency_contact_name && formData.emergency_contact_phone;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const handleStepClick = (stepId) => {
    if (isStepComplete(stepId) || stepId === currentStep) {
      setCurrentStep(stepId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch (error) {
      console.error("Error registering patient:", error);
      toast.error('Failed to register patient. Please try again.', {
        id: loadingToast,
        icon: '❌',
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfo formData={formData} handleChange={handleChange} />;
      case 2:
        return <ContactInfo formData={formData} handleChange={handleChange} />;
      case 3:
        return <AddressInfo formData={formData} handleChange={handleChange} />;
      case 4:
        return <MedicalInfo formData={formData} handleChange={handleChange} />;
      case 5:
        return <EmergencyInfo formData={formData} handleChange={handleChange} />;
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
              onClick={() => {
                if (isStepComplete(currentStep)) {
                  setCurrentStep(currentStep + 1);
                } else {
                  toast.error('Please fill in all required fields before proceeding.');
                }
              }}
              className={`btn-primary ${
                !isStepComplete(currentStep) ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!isStepComplete(currentStep)}
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