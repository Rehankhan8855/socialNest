const express = require("express");
const router = express.Router();


const {
  updatePassword,
  editUser,
  deleteUser,
  getUser,
} = require("../controllers/profile");

router.post("/update-password", updatePassword);
router.post("/edit-profile", editUser);
router.post("/delete-user", deleteUser);
router.get("/get-user/:id", getUser);

module.exports = router;