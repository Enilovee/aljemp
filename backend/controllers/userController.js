import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js'
import generateToken from '../backutils/generateToken.js';

// @descrp   Auth User & get token
// @route    POST/api/user/login
// @access    Public 
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @descrp   Register user
// @route    POST/api/user
// @access    Public 
const registerUser  = asyncHandler(async (req, res) => {
  const{ name, email, password} = req.body
  const  userExists = await User.findOne({ email })
    if(userExists){
      res.status(400)
      throw new Error('user already exist')
    }

    const user = await User.create({
      name,
      email,
      password
    })

    if(user) {
      generateToken(res, user._id)
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      })
    } else{
      res.status(400)
      throw new Error('Invalid user data')
    }
});

// @descrp  Logout user& clr cookie
// @route    POST/api/user/logouto
// @access    Private 
const logoutUser  = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  })

  res.status(200).json({ message: 'logged out successfully'})
 });

// @descrp  Get user profile
// @route    GET/api/user/logout
// @access    Private 
const getUserProfile  = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if(user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
  })
 } else{
  res.status(404)
  throw new Error('User Not found')
 }
 });

// @descrp  Update user profile
// @route    POST/api/user/logout
// @access    Private
const updateUserProfile  = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if(user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    if( req.body.password){
      user.password = req.body.password
    }
    const updatedUser = await user.save()

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    })
  } else{
    res.status(404)
    throw new Error('User Not found')
  }
});

// @descrp  Get all user
// @route    GET/api/user
// @access    Private/Admin
const getAllUser  = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users)
});

// @descrp  Get  user by id
// @route    GET/api/user/:id
// @access    Private/Admin
const getUserByID  = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

    if(user){
      res.status(200).json(user);
    }else{
      res.status(400)
      throw new Error('User not found')
    }
 });

// @descrp  Delete  user
// @route    POST/api/user/:id
// @access    Private/Admin
const deleteUser  = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    if(user){
      if(user.isAdmin){
        res.status(400)
        throw new Error('Cannot delete admin')
      }
      await User.deleteOne({ _id : user._id})
      res.status(200).json({ message: " The user has been deleted"})
    } else{
      res.status(404)
      throw new Error('User does not exist')
    }
 });

// @descrp  Update  user
// @route    PUT/api/user/:id
// @access    Private/Admin
const UpdateUser  = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.isAdmin = Boolean(req.body.isAdmin)

      const updatedUser = await user.save()

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      })
    } else {
      res.status(404)
      throw new Error('User does not exist')
    }

 });

 
export{
    authUser,
     registerUser, 
     logoutUser, 
     getAllUser,
      getUserByID, 
      getUserProfile,                          
      updateUserProfile, 
      deleteUser, 
      UpdateUser    
}