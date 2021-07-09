const PasswordsMatch = (firstPassword, secondPassword) => {
  if (firstPassword.length != 0 && secondPassword.length != 0) {
    if (firstPassword === secondPassword) {
      return null;
    }  
  }
  return "Your passwords do not match";
};

export default PasswordsMatch;
