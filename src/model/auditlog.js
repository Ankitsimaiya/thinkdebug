import mongoose from 'mongoose'
import { DEFAULT_ECDH_CURVE } from 'tls'

const AuditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['upload', 'download'],
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  timestamp: { type: Date, default: Date.now }
})
const AuditLog = mongoose.model('AuditLog', AuditLogSchema)

export default AuditLog
