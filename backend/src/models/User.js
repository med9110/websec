import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Format d\'email invalide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
    select: false
  },
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true,
    maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    default: null
  },
  refreshToken: {
    type: String,
    select: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.refreshToken;
      delete ret.__v;
      return ret;
    }
  }
});

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email }).select('+password +refreshToken');
};

const User = mongoose.model('User', userSchema);

export default User;
