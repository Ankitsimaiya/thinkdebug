import multer from 'multer'
import path from 'path'
import fs from 'fs'
import File from '../model/file.js'
import AuditLog from '../model/auditlog.js'
import User from '../model/user.js'

const uploadDir = path.join(path.resolve(), 'src/uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const upload = multer({ dest: uploadDir })

let io
function setSocketIO (ioInstance) {
  io = ioInstance
}

const uploadFile = async (req, res) => {
  try {
    console.log('📥 Upload request received')
    const userId = req.user.id

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (!user.organization) {
      return res.status(400).json({ error: 'User organization is required' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const fileDoc = await File.create({
      filename: req.file.originalname,
      path: req.file.path,
      uploadedBy: userId,
      organization: user.organization
    })

    await AuditLog.create({
      action: 'upload',
      user: userId,
      file: fileDoc._id,
      organization: user.organization
    })

    io?.to('admins').emit('file:uploaded', {
      fileName: fileDoc.filename,
      uploadedBy: user.username,
      timestamp: new Date()
    })

    res.json({ message: 'File uploaded successfully', fileId: fileDoc._id })
  } catch (err) {
    console.error(' Upload error:', err.message)
    res.status(500).json({ error: err.message })
  }
}

const downloadFile = async (req, res) => {
  try {
    const fileId = req.params.id
    const user = req.user
    const file = await File.findById(fileId).populate('uploadedBy')

    if (!file) {
      return res.status(404).json({ error: 'File not found' })
    }
    await AuditLog.create({
      action: 'download',
      user: user.id,
      file: file._id,
      organization: user.organization
    })

    io?.to(file.uploadedBy._id.toString()).emit('file:downloaded', {
      downloadedBy: user.username,
      fileId: file._id,
      timestamp: new Date()
    })

    res.download(file.path, file.filename)
  } catch (err) {
    console.log(err)
    console.error(' Download error:', err.message)
    res.status(500).json({ error: err.message })
  }
}

const fileState = async (req, res) => {
  try {
    const stats = await AuditLog.aggregate([
      { $match: { action: 'download' } },
      {
        $group: {
          _id: '$file',
          downloads: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'files',
          localField: '_id',
          foreignField: '_id',
          as: 'file'
        }
      },
      { $unwind: '$file' },
      {
        $project: {
          _id: 0,
          fileId: '$file._id',
          fileName: '$file.filename',
          downloads: 1
        }
      }
    ])
    res.json(stats)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export { upload, fileState, setSocketIO, uploadFile, downloadFile }
