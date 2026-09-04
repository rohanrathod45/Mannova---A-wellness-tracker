// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//   try {
//     const authHeader = req.header("Authorization");

//     console.log("Authorization Header:", authHeader);

//     if (!authHeader) {
//       return res.status(401).json({
//         message: "Access denied. No token provided.",
//       });
//     }

//     const token = authHeader.startsWith("Bearer ")
//       ? authHeader.split(" ")[1]
//       : authHeader;

//     console.log("Extracted Token:", token);

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     console.log("Decoded:", decoded);

//     req.user = decoded;

//     next();
//   } catch (error) {
//     console.log("JWT Error:", error.message);

//     return res.status(401).json({
//       message: "Invalid token",
//     });
//   }
// };

// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");


const authMiddleware = (req, res, next) => {

  try {

    const authHeader =
      req.headers.authorization;


    // Check Authorization header
    if (!authHeader) {

      return res.status(401).json({

        success: false,

        message: "Authentication required"

      });

    }


    // Expected:
    // Authorization: Bearer TOKEN

    if (!authHeader.startsWith("Bearer ")) {

      return res.status(401).json({

        success: false,

        message: "Invalid authorization format"

      });

    }


    const token =
      authHeader.split(" ")[1];


    if (!token) {

      return res.status(401).json({

        success: false,

        message: "Authentication token missing"

      });

    }


    // Verify JWT
    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    // Attach user information
    req.user = decoded;


    // Continue
    next();


  } catch (error) {

    console.error(
      "Authentication Error:",
      error.message
    );


    return res.status(401).json({

      success: false,

      message: "Invalid or expired token"

    });

  }

};


module.exports = authMiddleware;