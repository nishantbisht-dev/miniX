/*
  Generates a random password using only uppercase and lowercase letters.

  Requirement:
  - No numbers
  - No special characters
*/

function generateLetterPassword(length = 10) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  let password = "";

  for (let i = 0; i < length; i += 1) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    password += letters[randomIndex];
  }

  return password;
}

module.exports = generateLetterPassword;