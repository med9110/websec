import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est requis']
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'L\'événement est requis']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed'
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

registrationSchema.index({ user: 1, event: 1 }, { unique: true });
registrationSchema.index({ event: 1 });
registrationSchema.index({ user: 1 });
registrationSchema.index({ status: 1 });

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
