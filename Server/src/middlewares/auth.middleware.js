import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const verifyJWT = asyncHandler(async (req, _res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    throw new ApiError(401, 'Unauthorized request')
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  try {
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || 'secret'
    )

  const user = await User.findById(decodedToken?._id).select('-password -refreshToken')
    const user = await User.findById(decodedToken?._id).select('-password -refreshToken')

  if (!user) {
    throw new ApiError(401, 'Invalid access token')
    if (!user) {
      throw new ApiError(401, 'Invalid access token')
    }

    req.user = user
    next()
  } catch (err) {
    if (err instanceof ApiError) throw err
    throw new ApiError(401, err?.message || 'Invalid or expired token')
  }

  req.user = user
  next()
})