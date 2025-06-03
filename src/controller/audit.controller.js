import AuditLog from "../model/auditlog.js";


const auditController = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('user', 'username')
      .populate('file', 'filename')
      .populate('organization', 'name')
      .sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export default auditController