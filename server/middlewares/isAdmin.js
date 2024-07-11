// isAdmin.js

exports.isAdmin = (req, res, next) => {
    // Assuming the role information is stored in req.user.role after authentication
    if (req.user && req.user.role === 'admin') {
      next(); // Role is admin, continue to the next middleware/route handler
    } else {
      return res.status(403).json({ message: 'Unauthorized. Admin role required.' });
    }
  };
  

  