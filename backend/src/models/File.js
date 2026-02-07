import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true,
    unique: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  associatedWith: {
    model: {
      type: String,
      enum: ['Event', 'User'],
      required: true
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

fileSchema.index({ uploadedBy: 1 });
fileSchema.index({ 'associatedWith.model': 1, 'associatedWith.id': 1 });
fileSchema.index({ createdAt: -1 });

const File = mongoose.model('File', fileSchema);

export default File;
