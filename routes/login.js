var express = require('express');
var router = express.Router();
var UserSchema = require('../models/users.model')
var jwt = require('jsonwebtoken')

// Route สำหรับ login
router.post('/' , async function(req, res, naxt) {
  let { username, password } = req.body;

  try {  
    // หาผู้ใช้จาก username
    let user = await UserSchema.findOne({username}).select('+password');
    // console.log(user)
    if (!user) {
      // // สมัครสมาชิกใหม่
      // let newUser = new UserSchema({
      //   username,
      //   password,
      //   isApproved: false,  // กำหนดสถานะเป็น 'รอการอนุมัติ'
      // });
      // // บันทึกผู้ใช้ใหม่
      // await newUser.save();
      // return res.status(200).json({
      //   message: 'User registered successfully, please wait for approval.',
      // });
      return res.status(401).json({
        status: 401,
        message: 'User not found, Please Register.',
        data: null
      });
    }

    // ถ้าพบผู้ใช้ในระบบ
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        status: 401, 
        message: 'Invalid Password.',
        data: null 
      });
    }
    //### let u = await UserSchema.findOne().select('username');
    
    // ตรวจสอบว่าได้รับการอนุมัติหรือไม่
    if (!user.isApproved) {
      return res.status(403).json({
        status: 403, 
        message: 'Your account is pending approval. Please wait for admin approval.',
        data: user
      });
    }

    // Passwords match, proceed with authentication (e.g., generate a JWT)
    if (user.isApproved === true){
      // สร้าง JWT token
      let token = jwt.sign(
        { id: user._id, username: user.username , role: user.role },
        'asdf',
        {expiresIn: '168h'}
        
      );
    // let decode = jwt.verify(token, 'asdf')
    // console.log(decode);  
      return res.status(200).json({
        status: 200,
        message: 'Login successful',
        token: token
      });
    }

  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Server Timeout",
      data: []
    });
  }
});

module.exports = router;
