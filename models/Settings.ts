import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  notifications: {
    email: {
      orderUpdates: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
      security: { type: Boolean, default: true },
    },
    push: {
      orderUpdates: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
      security: { type: Boolean, default: true },
    },
  },
  displayPreferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    language: {
      type: String,
      default: 'en',
    },
  },
  privacySettings: {
    profileVisibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    showEmail: { type: Boolean, default: false },
    showPhone: { type: Boolean, default: false },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema); 