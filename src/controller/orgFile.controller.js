import mongoose from 'mongoose';
import File from '../model/file.js';

export const getFilesByOrganization = async (req, res) => {
  const { orgId } = req.params;
  try {
    const files = await File.aggregate([
      { $match: { organization: new mongoose.Types.ObjectId(orgId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'uploadedBy',
          foreignField: '_id',
          as: 'uploader'
        }
      },
      { $unwind: '$uploader' },
      {
        $project: {
          filename: 1,
          uploadedAt: 1,
          'uploader.username': 1
        }
      }
    ]);
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
