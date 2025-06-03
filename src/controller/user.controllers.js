import User from '../model/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import Organization from '../model/organization.js'

const jwt_secret = process.env.JWT_SECRET

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, organization } = req.body
    if (!name || !email || !password) {
      return res.status(404).json({ messaage: 'Please enter all details ' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role,
      organization: organization
    })

    if (!organization) {
      const org = Organization({
        name: name
      })
      const neworg = await org.save()
      user.organization = neworg._id
    }

    await user.save()
    return res.json({ message: 'User register', user })
  } catch (error) {
    console.log('erro', error)
    return res.status(500).json({ message: 'error in register User', error })
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email: email })
    if (!user) return res.status(403).json({ message: 'user not found' })

    const isPassword = await bcrypt.compare(password, user.password)

    if (!isPassword)
      return res.status(402).json({ message: 'Invalid Password ' })

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        organization: user.organization,
        role: user.role
      },
      jwt_secret
    )
    user.password = null

    return res
      .status(200)
      .json({ message: 'User Loggged in', token: token, user })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Eror in login user ', error })
  }
}

const creatOrg = async (req, res) => {
  const { name } = req.body
  try {
    const org = Organization({
      name: name
    })

    const neworg = await org.save()
    return res.json({ message: 'org created', org: neworg })
  } catch (error) {}
}

export { registerUser, loginUser, creatOrg }
