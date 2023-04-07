const transForm = (formType) => {
  switch(formType) {
    case 'username':
      return { id: formType, label: 'Username', username: true };
    case 'newUsername':
      return { id: formType, label: 'New Username', username: true };
    case 'password':
      return { id: formType, label: 'Password', username: false };
    case 'newPassword':
      return { id: formType, label: 'New Password', username: false };
  }
};

export default transForm;
