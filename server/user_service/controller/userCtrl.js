const Users = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')
dotenv.config()

const userCtrl = {
    register: async (req, res) => {
      try {
        const { name, email, password } = req.body;
        const user = await Users.findOne({ email });
        if (user)
          return res.json({ msg: "The email already exists.", success: false });
  
        if (password.length < 6)
          return res
            .json({ msg: "Password is at least 6 characters long.", success: false });
  
        // Password Encryption
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new Users({
          name,
          email,
          password: passwordHash,
        });
  
        await newUser.save();
  
        const accessToken = createAccessToken({ id: newUser._id });
        const refreshToken = createRefreshToken({ id: newUser._id });
        
        
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          path: `/api_user/refresh_token`,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
        });
  
        res.json({ accessToken,success:true });
      } catch (err) {
        return res.status(500).json({ msg: err.message });
      }
    },
    login: async (req, res) => {
      try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email });
        if (!user) return res.json({ msg: "User does not exist.", success: false });
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ msg: "Incorrect password.", success: false });
        const accessToken = createAccessToken({ id: user._id });
        const refreshToken = createRefreshToken({ id: user._id });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          path: `/api_user/refresh_token`,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
        });
  
        res.json({ accessToken,success:true });
      } catch (err) {
        return res.status(500).json({ msg: err.message });
      }
    },
    logout: async (req, res) => {
      try {
        res.clearCookie("refreshToken", { path: `/api_user/refresh_token` });
        return res.json({ msg: "Logged out" });
      } catch (err) {
        return res.status(500).json({ msg: err.message });
      }
    },
    refreshToken: (req, res) => {
      try {
        const rf_token = req.cookies.refreshToken;
        // res.json({rf_token})
        if (!rf_token)
          return res.json({ msg: "Please Login or Register" });
  
        jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
          if (err)
            return res.json({ msg: "Please Login or Register" });
  
          const accessToken = createAccessToken({ id: user.id });
  
          res.json({ accessToken });
        });
      } catch (err) {
        return res.status(500).json({ msg: err.message });
      }
    },
    getUser: async (req, res) => {
      try {
        const user = await Users.findById(req.user.id).select("-password");
        if (!user) return res.status(400).json({ msg: "User does not exist." });
  
        res.json(user);
      } catch (err) {
        return res.status(500).json({ msg: err.message });
      }
    }
  };
  
  const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "11m" });
  };
  const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
  };
  
  module.exports = userCtrl;