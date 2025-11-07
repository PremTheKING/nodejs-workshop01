const mongoose = require('mongoose')
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: { 
        type: String },
    password: { 
        type: String,
        required: [true, 'Password is required'] },
    isApproved: { 
        type: Boolean,
        default: false },
    role: { type: String,
        enum: ['user', 'admin'],
        default: 'user' }
}, {
    timestamps: true
});
// // การเข้ารหัสรหัสผ่านก่อนที่จะบันทึกข้อมูลลงในฐานข้อมูล
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next(); // ถ้าไม่ได้เปลี่ยนรหัสผ่านไม่ต้องทำอะไร

//   // สร้าง salt สำหรับการเข้ารหัส
//   const salt = await bcrypt.genSalt(10);
//   // เข้ารหัสรหัสผ่าน
//   this.password = await bcrypt.hash(this.password, salt);

//   next(); // ต่อไปให้ไปที่ขั้นตอนถัดไป
// });

// เมธอดสำหรับตรวจสอบรหัสผ่าน
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password); // เปรียบเทียบรหัสผ่านที่กรอกกับรหัสผ่านที่เข้ารหัสแล้ว
};

module.exports = mongoose.model('user', userSchema)