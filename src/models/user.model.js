class User {
  constructor({ email, password, userName, firstName, lastName }) {
    this.email = email;
    this.password = password;
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  parseRaw() {
    return {
      email: this.email,
      password: this.password,
      userName: this.userName,
      firstName: this.firstName,
      lastName: this.lastName,
    };
  }
}

module.exports = User;
