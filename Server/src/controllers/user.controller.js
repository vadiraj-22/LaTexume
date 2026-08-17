import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'

// ─── Helper: generate both tokens and save refresh token to DB ──────────────
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(500, 'Something went wrong while generating refresh and access token')
  }
}

// ─── POST /api/v1/users/register ────────────────────────────────────────────
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body

  // Validate required fields
  if ([fullName, email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, 'All fields are required')
  }

  // Strong Password Policy Validation:
  // At least 8 chars, 1 uppercase (A-Z), 1 lowercase (a-z), 1 number (0-9), 1 special character (@$!%*?&^#\-_+=~`)
  const hasMinLength = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[@$!%*?&^#\-_+=~`]/.test(password)

  if (!hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
    throw new ApiError(
      400,
      'Password must be at least 8 characters long and include an uppercase letter (A-Z), a lowercase letter (a-z), a number (0-9), and a special character (!@#$%^&*).'
    )
  }

  // Check if user already exists
  const existedUser = await User.findOne({ email: email.toLowerCase() })
  if (existedUser) {
    throw new ApiError(409, 'User with this email already exists')
  }

  // Handle optional avatar upload
  let avatarUrl = ''
  if (req.file) {
    const uploaded = await uploadOnCloudinary(req.file.path)
    if (uploaded) avatarUrl = uploaded.url
  }

  // Create user
  const user = await User.create({
    fullName,
    avatar: avatarUrl,
    email: email.toLowerCase(),
    password,
  })

  const createdUser = await User.findById(user._id).select('-password -refreshToken')

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering the user')
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, 'User registered successfully'))
})

// ─── POST /api/v1/users/login ────────────────────────────────────────────────
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email) {
    throw new ApiError(400, 'Email is required')
  }

  if (!password) {
    throw new ApiError(400, 'Password is required')
  }

  const user = await User.findOne({ email: email.toLowerCase() })

  if (!user) {
    throw new ApiError(404, 'User does not exist')
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials')
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).select('-password -refreshToken')

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  }

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        'Logged in successfully'
      )
    )
})

// ─── POST /api/v1/users/logout ───────────────────────────────────────────────
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } }, // $unset is cleaner than $set: undefined
    { new: true }
  )

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  }

  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, {}, 'Logged out successfully'))
})

// ─── GET /api/v1/users/me ────────────────────────────────────────────────────
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, 'Current user fetched successfully'))
})
// ─── PATCH /api/v1/users/update-account ──────────────────────────────────────
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName } = req.body

  if (!fullName || !fullName.trim()) {
    throw new ApiError(400, 'Full name is required')
  }

  let avatarUrl
  if (req.file) {
    const uploaded = await uploadOnCloudinary(req.file.path)
    if (!uploaded) {
      throw new ApiError(500, 'Failed to upload avatar image')
    }
    avatarUrl = uploaded.url
  }

  const updateData = { fullName: fullName.trim() }
  if (avatarUrl) {
    updateData.avatar = avatarUrl
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: updateData,
    },
    { new: true }
  ).select('-password -refreshToken')

  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Account details updated successfully'))
})

export { registerUser, loginUser, logoutUser, getCurrentUser, updateAccountDetails }