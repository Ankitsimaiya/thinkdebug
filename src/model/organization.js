import mongoose from "mongoose"

const organizationSchema = mongoose.Schema({
    name : String,
    email : String
})

const Organization = new mongoose.model('Organization',organizationSchema)

export default Organization