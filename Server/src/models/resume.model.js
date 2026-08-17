import mongoose, { Schema } from 'mongoose'

const resumeSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Resume title is required'],
      trim: true,
      default: 'Untitled Resume',
    },
    templateId: {
      type: String,
      default: 'jake',
    },
    formData: {
      type: Schema.Types.Mixed,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export const Resume = mongoose.model('Resume', resumeSchema)
