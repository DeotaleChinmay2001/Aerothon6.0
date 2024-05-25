const CryptoJS = require('crypto-js');

const encryptionKey = 'airbusaerothon6';

const decryptMiddleware = (req, res, next) => {
  try {
    if (req.body.data) {
      const bytes = CryptoJS.AES.decrypt(req.body.data, encryptionKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      
      const parsedData = JSON.parse(decryptedData);

      req.body = parsedData;
    }
    next();
  } catch (error) {
    console.error('Error decrypting request data:', error);
    res.status(400).json({ message: 'Invalid request data' });
  }
};

module.exports = decryptMiddleware;
