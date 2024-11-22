export const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const newDate = new Date(date);
    return newDate.toLocaleDateString('sk-SK', options); // Slovenský formát dátumu
  };
  
  export const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
  
    // Adjust the age if the birthday hasn't occurred yet this year
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
  
    return age;
  };
  