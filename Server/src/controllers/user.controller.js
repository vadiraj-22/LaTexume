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
  const { fullName, email, username, password } = req.body

  // Validate required fields
  if ([fullName, email, username, password].some((field) => !field?.trim())) {
    throw new ApiError(400, 'All fields are required')
  }

  // Check if user already exists
  const existedUser = await User.findOne({ $or: [{ username }, { email }] })
  if (existedUser) {
    throw new ApiError(409, 'User with this email or username already exists')
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
    email,
    password,
    username: username.toLowerCase(),
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
  const { username, email, password } = req.body

  if (!(username || email)) {
    throw new ApiError(400, 'Username or email is required')
  }

  if (!password) {
    throw new ApiError(400, 'Password is required')
  }

  const user = await User.findOne({ $or: [{ username }, { email }] })

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

export { registerUser, loginUser, logoutUser, getCurrentUser }