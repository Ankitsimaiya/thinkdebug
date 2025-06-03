import mongoose from "mongoose"


const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    password: {
      type: String
    },
    role : {
        type : String,
        enum:['admin','user'],
        default: 'user'
    },
    organization : {
        type  : mongoose.Schema.Types.ObjectId,
        ref  : 'Organization'
    }
  },
  {
    timeStamp: true
  }
)

const User = new mongoose.model('User', userSchema)

export default User

