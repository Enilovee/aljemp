import express from "express";
const router = express.Router();
import{
     authUser,
     registerUser, 
     logoutUser, 
     getAllUser,
      getUserByID, 
      getUserProfile,                          
      updateUserProfile, 
      deleteUser, 
      UpdateUser  
 } from '../controllers/userController.js'
 import { protect, admin } from "../middleware/authMiddleware.js";

router.route('/').post(registerUser).get(protect, admin, getAllUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.route('/profile').get( protect, getUserProfile).put(protect, updateUserProfile);
router.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUserByID).put(protect, admin, UpdateUser);



export default router;