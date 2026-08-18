import mongoose from 'mongoose'
import { Resume } from '../models/resume.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { templateEngine } from '../../lib/templateEngine.js'
import { compileTex } from '../../lib/compiler.js'

/**
 * Create or Update a saved resume for authenticated user.
 */
export const saveResume = asyncHandler(async (req, res) => {
  const { resumeId, title, templateId, formData } = req.body

  if (!formData || !formData.header) {
    throw new ApiError(400, 'Resume data is required.')
  }

  const resumeTitle = title?.trim() || formData.header.name ? `${formData.header.name}'s Resume` : 'Untitled Resume'
  const selectedTemplate = templateId || formData.templateId || 'jake'

  let resume

  if (resumeId) {
    resume = await Resume.findOne({ _id: resumeId, owner: req.user._id })
    if (!resume) {
      throw new ApiError(404, 'Resume not found or unauthorized')
    }
    resume.title = resumeTitle
    resume.templateId = selectedTemplate
    resume.formData = formData
    await resume.save()
  } else {
    resume = await Resume.create({
      owner: req.user._id,
      title: resumeTitle,
      templateId: selectedTemplate,
      formData,
    })
  }

  return res.status(200).json(
    new ApiResponse(200, resume, resumeId ? 'Resume updated successfully' : 'Resume saved successfully')
  )
})

/**
 * Get all saved resumes for logged-in user.
 */
export const getUserResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ owner: req.user._id })
    .select('title templateId isPublic viewsCount downloadsCount updatedAt createdAt')
    .sort({ updatedAt: -1 })

  return res.status(200).json(
    new ApiResponse(200, resumes, 'User resumes retrieved successfully')
  )
})

/**
 * Get a single resume by ID.
 */
export const getResumeById = asyncHandler(async (req, res) => {
  const { id } = req.params

  const resume = await Resume.findOne({ _id: id, owner: req.user._id })
  if (!resume) {
    throw new ApiError(404, 'Resume not found')
  }

  return res.status(200).json(
    new ApiResponse(200, resume, 'Resume fetched successfully')
  )
})

/**
 * Delete a resume by ID.
 */
export const deleteResume = asyncHandler(async (req, res) => {
  const { id } = req.params

  const resume = await Resume.findOneAndDelete({ _id: id, owner: req.user._id })
  if (!resume) {
    throw new ApiError(404, 'Resume not found or unauthorized')
  }

  return res.status(200).json(
    new ApiResponse(200, null, 'Resume deleted successfully')
  )
})

/**
 * Toggle isPublic status for a resume.
 */
export const togglePublicStatus = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { isPublic } = req.body

  const resume = await Resume.findOne({ _id: id, owner: req.user._id })
  if (!resume) {
    throw new ApiError(404, 'Resume not found or unauthorized')
  }

  resume.isPublic = typeof isPublic === 'boolean' ? isPublic : !resume.isPublic
  await resume.save()

  return res.status(200).json(
    new ApiResponse(200, resume, `Resume public status set to ${resume.isPublic}`)
  )
})

/**
 * Get public resume details by ID (No auth required).
 */
export const getPublicResume = asyncHandler(async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(404, 'Public resume not found or link has expired')
  }

  const resume = await Resume.findOne({ _id: id, isPublic: true })
    .populate('owner', 'fullName email avatar')
    .select('title templateId formData viewsCount downloadsCount createdAt updatedAt owner')

  if (!resume) {
    throw new ApiError(404, 'Public resume not found or link has expired')
  }

  // Increment view count
  resume.viewsCount = (Number.isInteger(resume.viewsCount) ? resume.viewsCount : 0) + 1
  await resume.save({ validateBeforeSave: false })

  return res.status(200).json(
    new ApiResponse(200, resume, 'Public resume fetched successfully')
  )
})

/**
 * Compile and stream public resume PDF (No auth required).
 */
export const getPublicResumePdf = asyncHandler(async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(404, 'Public resume not found or link has expired')
  }

  const resume = await Resume.findOne({ _id: id, isPublic: true })
  if (!resume) {
    throw new ApiError(404, 'Public resume not found or link has expired')
  }

  // Increment download count
  resume.downloadsCount = (Number.isInteger(resume.downloadsCount) ? resume.downloadsCount : 0) + 1
  await resume.save({ validateBeforeSave: false })

  // Compile .tex to PDF
  const texSource = templateEngine(resume.formData)
  const pdfBuffer = await compileTex(texSource)

  res.set('Content-Type', 'application/pdf')
  res.set('Content-Disposition', `inline; filename="${(resume.title || 'resume').replace(/\s+/g, '_')}.pdf"`)
  res.send(pdfBuffer)
})
