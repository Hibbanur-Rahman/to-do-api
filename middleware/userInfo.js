const userModel = require('../models/userModel');

module.exports.userInfo = async (req, res, next) => {
  const { user } = req; // Assuming the user object is stored in req.user

  try {
    const foundUser = await userModel.findOne({ email: user.email });
    
    if (!foundUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    req.user = foundUser; // Attach the found user object to req.user
    next();
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
