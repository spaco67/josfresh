import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['customer', 'farmer', 'investor', 'admin'],
    default: 'customer',
  },
  farmDetails: {
    farmName: String,
    location: String,
    products: [String],
    description: String,
  },
  shippingAddresses: [{
    street: String,
    city: String,
    state: String,
    postalCode: String,
    isDefault: Boolean,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet'
  },
  investmentProfile: {
    type: {
      experience: {
        type: String,
        enum: ['beginner', 'intermediate', 'expert'],
      },
      riskTolerance: {
        type: String,
        enum: ['conservative', 'moderate', 'aggressive'],
      },
      preferredSectors: [String],
      investmentGoals: [String],
      totalInvested: {
        type: Number,
        default: 0,
      },
      activeInvestments: {
        type: Number,
        default: 0,
      },
      completedInvestments: {
        type: Number,
        default: 0,
      },
      totalReturns: {
        type: Number,
        default: 0,
      },
    },
    default: {},
  },
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check password
UserSchema.methods.matchPassword = async function(enteredPassword: string) {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log('Password match result:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Password match error:', error);
    return false;
  }
};

export default mongoose.models.User || mongoose.model('User', UserSchema); 