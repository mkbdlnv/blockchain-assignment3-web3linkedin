
const db = require('../db');
const bcrypt = require('bcrypt');

class UserModel {
  async createUser(email, username, password) {
    try {
      const hashedPassword = await this.hashPassword(password);
      const result = await db.query(
        'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *',
        [email, username, hashedPassword]
      );

      if (result.rows.length === 1) {
        const newUser = result.rows[0];
        return newUser;
      } else {
        throw new Error('User creation failed.');
      }
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }
  }

  async getUserByUsername(username) {
    try {
      const result = await db.query('SELECT * FROM users WHERE username = $1', [
        username,
      ]);

      if (result.rows.length === 1) {
        const user = result.rows[0];
        return user;
      } else {
        return null; 
      }
    } catch (error) {
      console.error('Error retrieving user:', error.message);
      throw error;
    }
  }


  async hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(inputPassword, hashedPassword) {
    return bcrypt.compare(inputPassword, hashedPassword);
  }
}

module.exports = new UserModel();
