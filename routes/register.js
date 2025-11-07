var express = require('express');
var router = express.Router();
var UserSchema = require('../models/users.model.js')
const bcrypt = require('bcrypt')
// const tokenMiddleware = require('../middleware/token.middleware.js')

// Route สำหรับ login
router.post('/', async function(req, res, naxt) {
  let { username, password } = req.body;

  try { 
    let user = await UserSchema.findOne({username});
    if (!user) {
      // สมัครสมาชิกใหม่
      let newUser = new UserSchema({
        username: username,
        password: await bcrypt.hash(password, 10),
        isApproved: false  // กำหนดสถานะเป็น 'รอการอนุมัติ'
      });

      // บันทึกผู้ใช้ใหม่
      await newUser.save();
      return res.status(200).json({
        status: 200,
        message: 'User registered successfully, please wait for approval.',
        data: newUser
      });
    }

    return res.status(409).json({
      status: 409,
      message: 'This username is already in use.',
      data: null 
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Server Timeout",
      data: []
    });
  }
});


module.exports = router;


