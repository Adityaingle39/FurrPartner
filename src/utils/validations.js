export const validateFields = ({
    selectedValue,
    adminDesignationName,
    adminPhone,
    adminExperience,
    adminAbout,
    adminWorkplaceName,
    adminAddress,
    adminTown,
    adminCity,
    adminPincode,
    adminState,
    startTime,
    endTime,
    selectedCheckboxes,
    selectedName,
    educationList,
    expertiseList,
    breakStartTime,
		breakEndTime,
    location
  }) => {
    if (selectedValue && (!selectedValue || selectedValue === '')) {
        return 'Please select a Service.';
      }
      else if (adminDesignationName === '') {
      return 'Please fill Designation field.';
    }

    if (adminPhone === '') {
      return 'Please fill Phone field.';
    }

    if (adminExperience === '') {
      return 'Please fill Experience field.';
    }
    
    if (adminAbout === '') {
      return 'Please fill About field.';
    }
    
    if (adminWorkplaceName === '') {
      return 'Please fill workspace Name field.';
    }
    
    if (adminAddress === '') {
      return 'Please fill Address field.';
    }
    
    if (adminTown === '') {
      return 'Please fill Town field.';
    }
    
    if (adminCity === '') {
      return 'Please fill City field.';
    }
    
    if (adminPincode === '') {
      return 'Please fill Pincode field.';
    }
    
    if (adminState === '') {
      return 'Please fill State field.';
    }
    
    if (startTime === null) {
      return 'Please select a Start Time.';
    }
    
    if (endTime === null) {
      return 'Please select an End Time.';
    }
    if (breakStartTime === null) {
      return 'Please select a Break Start Time.';
    }
    
    if (breakEndTime === null) {
      return 'Please select an Break End Time.';
    }
    
    if (selectedCheckboxes && selectedCheckboxes.length === 0) {
      return 'Please select at least one checkbox.';
    }
    
    if (selectedName === 'Veterinary' && (educationList.length === 0 || expertiseList.length === 0)) {
      return 'For Veterinary, please fill in Education and Expertise fields.';
    }
    
    if (location === null) {
      return 'Please select your location.';
    }

    return null;
  };