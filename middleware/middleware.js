// middleware/middleware.js

const axios = require('axios');
const { logger } = require('../logger')

// middlwarwe validate user
const validateUser = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  try {
    const response = await axios({
        method: 'post',
        url: `${process.env.AUTH_API_URL}/auth/validate-user`,
        headers: {
          'authorization': token
        },
        data: {
          token: token
        }
      });
      

    if (response.data.isValid) {
      next();
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// helper function 
const getUserId = async (req, user_id) => {
    try {
      const token = req.headers.authorization;
  
      if (!token) {
        logger.error("jwt token not found")
        return false
      }
      const response = await axios({
        method: 'get',
        url: `${process.env.AUTH_API_URL}/auth/user-id?user_id=${user_id}`,
        headers: {
          'authorization': token
        }
      });
  
      if (!response.data.userId) {
        return false
      }
  
      req.userId = response.data.userId;
      return user_id
    } catch (error) {
      logger.error(error);
      return false
    }
  };
  

module.exports = {
  validateUser, getUserId,
};
