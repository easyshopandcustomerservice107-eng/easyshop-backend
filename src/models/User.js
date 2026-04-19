const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters'],
        default: null
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    phone: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'admin'
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    verificationToken: String,
    verificationTokenExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    refreshToken: String,
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
}, { timestamps: true });

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
    console.log('ENTERING PRE-SAVE HOOK');
    if (!this.isModified('password')) {
        console.log('PASSWORD NOT MODIFIED, SKIPPING HASH');
        return;
    }
    console.log('GENERATING SALT...');
    const salt = await bcrypt.genSalt(10);
    console.log('SALT GENERATED. HASHING PASSWORD...');
    this.password = await bcrypt.hash(this.password, salt);
    console.log('PASSWORD HASHED. EXITING PRE-SAVE HOOK');
});

// Sign JWT and return
userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d'
    });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
