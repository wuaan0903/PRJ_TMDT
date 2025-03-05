const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const session = require('express-session'); // Import express-session
const dotenv = require("dotenv");
dotenv.config();

const BACKEND_API_URL = "http://localhost:3001";
const SECRET_KEY = process.env.SECRET_KEY;

router.use(session({
  secret: process.env.SECRET_KEY, // Should be a secret key in your .env file
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false , httpOnly: true}, // Set secure true in production
}));

// Proxy API routes
router.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const backendResponse = await fetch(`${BACKEND_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return res.status(backendResponse.status).json(errorData);
    }

    const data = await backendResponse.json(); // Dữ liệu trả về từ backend API

    // Lấy userId từ phản hồi backend
    const { userId, accessToken, refreshToken } = data;


    // Save token in a sesssion
    req.session.token = data.refreshToken;

    // Set token as a cookie
    res.setHeader('Set-Cookie', cookie.serialize('token', refreshToken, {
      httpOnly: true,
      secure: false, // Đặt true khi dùng HTTPS
      path: '/',
      maxAge: 60 * 60
    }));

    // Trả về dữ liệu bao gồm cả userId
    res.status(200).json({ userId, accessToken, refreshToken });

  } catch (error) {
    console.error('Error during proxy login', error);
    res.status(500).json({ message: 'An error occurred while processing your request. Please try again later.' });
  }
});


router.post('/api/register', async (req, res) => {
  try {
    const { email, password, username, phone_number } = req.body;
    const backendResponse = await fetch(`${BACKEND_API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return res.status(backendResponse.status).json(errorData);
    }


    const data = await backendResponse.json();
    res.status(201).json(data);
  } catch (error) {
    console.error('Error during proxy registration', error);
    res.status(500).json({ message: 'An error occurred while processing your request. Please try again later.' });
  }
});

// Proxy for /auth/user
router.get('/auth/user', (req, res) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token;
    // Check for token in session first
    if (req.session && req.session.token) {
      console.log("Token found in session:", req.session.token);
      try {
          const decoded = jwt.verify(req.session.token, SECRET_KEY);
          return res.json({ success: true, user: decoded });
      } catch (error) {
        console.log("Error verifying token: ", error.message);
          return res.status(401).json({ success: false, message: 'Invalid Session Token' });
      }
  }
  if (!token) {
    console.log("No token in cookies or session");
    return res.status(401).json({ success: false, message: 'Not logged in' });
  }

  try {
      const decoded = jwt.verify(token, SECRET_KEY);
      res.json({ success: true, user: decoded });
      console.log("Token found in cookies");

  } catch (error) {
    console.log("Error verifying token: ", error.message)
    return res.status(401).json({ success: false, message: 'Invalid Token' });
  }
});

// Proxy for /auth/logout
router.get('/auth/logout', (req, res) => {
  // Clear session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session: ", err);
    } else {
      console.log("Session destroyed");
    }
  });
  res.setHeader('Set-Cookie', cookie.serialize('token', '', {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    path: '/',
    maxAge: 0
  }));
  // res.status(200).json({ success: true, message: 'Logged out' });
  res.redirect('/');
});

// Proxy to get user
router.get('/api/account/:userId', async (req, res) => {
  try {
    const backendResponse = await fetch(`${BACKEND_API_URL}/api/users/${req.params.userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return res.status(backendResponse.status).json(errorData);
    }

    const data = await backendResponse.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Error during proxy get users', error);
    res.status(500).json({ message: 'An error occurred while processing your request. Please try again later.' });
  }
});

// Proxy to get users with role 'user'
router.get('/api/account/role/user', async (req, res) => {
  try {
    const backendResponse = await fetch(`${BACKEND_API_URL}/api/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return res.status(backendResponse.status).json(errorData);
    }

    const users = await backendResponse.json();
    const usersWithUserRole = users.filter(user => user.role === 'user');
    res.status(200).json(usersWithUserRole);

  } catch (error) {
    console.error('Error during proxy get users with role user', error);
    res.status(500).json({ message: 'An error occurred while processing your request. Please try again later.' });
  }
});

// Proxy to get users with role 'staff'
router.get('/api/account/role/staff', async (req, res) => {
  try {
    const backendResponse = await fetch(`${BACKEND_API_URL}/api/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return res.status(backendResponse.status).json(errorData);
    }

    const users = await backendResponse.json();
    const usersWithUserRole = users.filter(user => user.role === 'staff');
    res.status(200).json(usersWithUserRole);

  } catch (error) {
    console.error('Error during proxy get users with role user', error);
    res.status(500).json({ message: 'An error occurred while processing your request. Please try again later.' });
  }
});

// Proxy to create a new user or staff account
router.post('/api/account', async (req, res) => {
  try {
    const { username, email, password, phone_number, role } = req.body;
    const backendResponse = await fetch(`${BACKEND_API_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password, phone_number, role })
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return res.status(backendResponse.status).json(errorData);
    }

    const data = await backendResponse.json();
    res.status(201).json(data);
  } catch (error) {
    console.error('Error during proxy create account', error);
    res.status(500).json({ message: 'An error occurred while processing your request. Please try again later.' });
  }
});

// Proxy to update a user or staff account
router.patch('/api/account/:userId', async (req, res) => {
  try {
    const { username, email, phone_number, role, password, birthDate, gender, height, weight } = req.body; // Thêm các trường mới
    const updateData = { username, email, phone_number, role, birthDate, gender, height, weight };

    // Chỉ thêm trường password nếu có giá trị
    if (password) {
      updateData.password = password;
    }

    const backendResponse = await fetch(`${BACKEND_API_URL}/api/users/${req.params.userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return res.status(backendResponse.status).json(errorData);
    }

    const data = await backendResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error during proxy update account', error);
    res.status(500).json({ message: 'An error occurred while processing your request. Please try again later.' });
  }
});

// Proxy to update user password
router.patch('/api/account/:userId/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const backendResponse = await fetch(`${BACKEND_API_URL}/api/users/${req.params.userId}/password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return res.status(backendResponse.status).json(errorData);
    }

    const data = await backendResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error during proxy update password', error);
    res.status(500).json({ message: 'An error occurred while processing your request. Please try again later.' });
  }
});



// Lấy danh sách địa chỉ của người dùng
router.get('/api/account/:userId/addresses', async (req, res) => {
  try {
    const backendResponse = await fetch(`${BACKEND_API_URL}/api/users/${req.params.userId}/addresses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return res.status(backendResponse.status).json(errorData);
    }

    const data = await backendResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error during proxy get addresses', error);
    res.status(500).json({ message: 'An error occurred while processing your request. Please try again later.' });
  }
});

// Lấy địa chỉ mặc định của người dùng
router.get('/api/account/:userId/addresses/default', async (req, res) => {
  try {
    const backendResponse = await fetch(`${BACKEND_API_URL}/api/users/${req.params.userId}/addresses/default`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return res.status(backendResponse.status).json(errorData);
    }

    const data = await backendResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error during proxy get default address', error);
    res.status(500).json({ message: 'An error occurred while processing your request. Please try again later.' });
  }
});

// Thêm địa chỉ mới cho người dùng
router.post('/api/account/:userId/addresses', async (req, res) => {
  const { nameKH, phoneNumber, address, ward, district, city, defaultAddress } = req.body;
  try {
    const backendResponse = await fetch(`${BACKEND_API_URL}/api/users/${req.params.userId}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nameKH, phoneNumber, address, ward, district, city, defaultAddress })
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return res.status(backendResponse.status).json(errorData);
    }

    const data = await backendResponse.json();
    res.status(201).json(data);
  } catch (error) {
    console.error('Error during proxy add address', error);
    res.status(500).json({ message: 'An error occurred while processing your request. Please try again later.' });
  }
});



// Cập nhật địa chỉ của người dùng
router.put('/api/account/:userId/addresses/:addressId', async (req, res) => {
  const { nameKH,phoneNumber, address, ward, district, city, defaultAddress } = req.body;
  try {
    const backendResponse = await fetch(`${BACKEND_API_URL}/api/users/${req.params.userId}/addresses/${req.params.addressId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nameKH,phoneNumber, address, ward, district, city, defaultAddress })
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return res.status(backendResponse.status).json(errorData);
    }

    const data = await backendResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error during proxy update address', error);
    res.status(500).json({ message: 'An error occurred while processing your request. Please try again later.' });
  }
});



// Xóa địa chỉ của người dùng
router.delete('/api/account/:userId/addresses/:addressId', async (req, res) => {
  try {
    const backendResponse = await fetch(`${BACKEND_API_URL}/api/users/${req.params.userId}/addresses/${req.params.addressId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return res.status(backendResponse.status).json(errorData);
    }

    const data = await backendResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error during proxy delete address', error);
    res.status(500).json({ message: 'An error occurred while processing your request. Please try again later.' });
  }
});

module.exports = router;