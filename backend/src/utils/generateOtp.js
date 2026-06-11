/*
  generateOtp creates a 6-digit OTP.

  Example:
  482913

  We keep it numeric because users can easily type it.
*/

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = generateOtp;