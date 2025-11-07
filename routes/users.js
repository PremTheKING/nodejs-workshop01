var express = require('express');
var router = express.Router();
var userSchema = require('../models/users.model.js')
const tokenMiddleware = require('../middleware/token.middleware.js')


router.put('/:id/approve',tokenMiddleware , async function(req, res, next) {
  try {
    // let admin = await userSchema.findOne({ _id: req.params.id });
    const { role } = req.auth;
    if ( role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin only' });
    }
    let { id } = req.params
    // ค้นหาผู้ใช้จาก ID
    let user = await userSchema.findById(id);
    if (!user) {
      return res.status(404).json({
        status: 404, 
        message: 'User not found',
        data: user
      });
    }

    // อัปเดตสถานะให้เป็น 'approved'
    user.isApproved = true;
    // let user_ = await userSchema.findByIdAndUpdate(id , {
    //   isApproved: true
    // }, { new: true })
    await user.save()
    res.status(200).json({ 
      status: 200, 
      message: 'User approved successfully',
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;