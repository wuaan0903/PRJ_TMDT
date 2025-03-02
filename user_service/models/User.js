import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const addressSchema = new mongoose.Schema({
  nameKH: { type: String, required: true },
  phoneNumber: { type: String, required: true,unique: true },
  address: { type: String, required: true },
  ward: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  defaultAddress: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true, unique: true},
  role: {type: String,default: 'user',enum:['user','admin','staff'], required: true},
  password: { type: String, required: true },
  refreshTokens: [{
    token: { type: String, required: false },
    createdAt: { type: Date, default: Date.now }
}],
  addresses: [addressSchema],
  createdAt: { type: Date, default: Date.now }
});



userSchema.pre('save', async function (next) {  
  const user = this;

  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
  } 

  next();
});

userSchema.statics.findByCredentials = async (email, password) => {
  try {
    const userPassword = await User.findOne({ email }).select('password');
    const user = await User.findOne({ email});
    // console.log(user)
    if (!user) {
      throw new Error('Unable to login!');
    }

    const isCorrect = await bcrypt.compare(password, userPassword.password);

    if (!isCorrect) {
      throw new Error('Unable to login!');
    }

    return user;
  }
  catch (error) {
    console.log(error);
    throw error;
  }


}

const User = mongoose.model('User', userSchema);
export default User;