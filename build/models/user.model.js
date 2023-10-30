var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        unique: true
    },
    hashedPassword: {
        type: String,
    },
    role: {
        enum: ["unassigned", "admin", "teacher", "student"],
    },
});
var User = mongoose.models.users || mongoose.model("user", userSchema);
export default User;
