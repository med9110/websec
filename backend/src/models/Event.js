import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    maxlength: [5000, 'La description ne peut pas dépasser 5000 caractères']
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: {
      values: ['conference', 'workshop', 'concert', 'sport', 'networking', 'other'],
      message: 'Catégorie invalide'
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  startDate: {
    type: Date,
    required: [true, 'La date de début est requise']
  },
  endDate: {
    type: Date,
    required: [true, 'La date de fin est requise'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'La date de fin doit être après la date de début'
    }
  },
  location: {
    address: {
      type: String,
      required: [true, 'L\'adresse est requise'],
      maxlength: [300, 'L\'adresse ne peut pas dépasser 300 caractères']
    },
    city: {
      type: String,
      required: [true, 'La ville est requise'],
      maxlength: [100, 'La ville ne peut pas dépasser 100 caractères']
    },
    postalCode: {
      type: String,
      maxlength: [20, 'Le code postal ne peut pas dépasser 20 caractères']
    },
    country: {
      type: String,
      default: 'France',
      maxlength: [100, 'Le pays ne peut pas dépasser 100 caractères']
    }
  },
  capacity: {
    type: Number,
    required: [true, 'La capacité est requise'],
    min: [1, 'La capacité doit être d\'au moins 1'],
    max: [100000, 'La capacité ne peut pas dépasser 100 000']
  },
  price: {
    type: Number,
    default: 0,
    min: [0, 'Le prix ne peut pas être négatif']
  },
  coverImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    default: null
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'organisateur est requis']
  },
  registrationCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ 'location.city': 1 });
eventSchema.index({ createdAt: -1 });

eventSchema.virtual('isFull').get(function() {
  return this.registrationCount >= this.capacity;
});

eventSchema.virtual('availableSpots').get(function() {
  return Math.max(0, this.capacity - this.registrationCount);
});

eventSchema.virtual('isPast').get(function() {
  return new Date() > this.endDate;
});

eventSchema.methods.incrementRegistration = async function() {
  if (this.registrationCount >= this.capacity) {
    throw new Error('Capacité maximale atteinte');
  }
  this.registrationCount += 1;
  return this.save();
};

eventSchema.methods.decrementRegistration = async function() {
  if (this.registrationCount > 0) {
    this.registrationCount -= 1;
    return this.save();
  }
  return this;
};

const Event = mongoose.model('Event', eventSchema);

export default Event;
