/* eslint-disable camelcase */
class User {
  parseRawFromObject({ email, password, userName, firstName, lastName }) {
    return {
      email,
      password,
      userName,
      firstName,
      lastName,
    };
  }

  parseRawFromQuery({ email, username, first_name, last_name, created_at, updated_at }) {
    return {
      email,
      userName: username,
      firstName: first_name,
      lastName: last_name,
      createdAt: created_at,
      updatedAt: updated_at,
    };
  }

  parseRawFromObjectToQuery({
    email,
    password,
    userName,
    firstName,
    lastName,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    return {
      email,
      username: userName,
      password,
      first_name: firstName,
      last_name: lastName,
      created_at: createdAt,
      updated_at: updatedAt,
    };
  }
}

module.exports = User;
