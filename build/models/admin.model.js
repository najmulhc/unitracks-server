var mongoose = require("mongoose");
var adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "admin",
    },
});
var Admin = mongoose.models.admin || mongoose.model("admin", adminSchema);
export default Admin;
