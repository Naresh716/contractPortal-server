const mongoose = require('mongoose')
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch')
// const Joi = require('joi');
// Joi.objectId = require('joi-objectid')(Joi)

var siteKeyInfo = { type: String };

// Application users information
const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, trim: true, minlength: 1, maxlength: 50 },
    email: { type: String, unique: true, required: true, minlength: 5, maxlength: 100, trim: true },
    password: { type: String, required: true },
    displayName: { type: String, required: true, minlength: 1, maxlength: 50 },
    firstName: { type: String, required: true, minlength: 1, maxlength: 50, trim: true },// First name of the user
    lastName: { type: String, required: true, minlength: 1, maxlength: 50, trim: true },// Last name of the user
    nickName: { type: String, required: true, minlength: 1, maxlength: 50, trim: true },
    website: { type: String, trim: true },
    bio: { type: String, trim: true },
    jabber: { type: String, trim: true },
    aol_im: { type: String, trim: true },
    yahoo_im: { type: String, trim: true },
    salt: { type: String },// Random generated key , using to encrypt or decrypt password to compare when user login(comparing hashedpassword)

});

userSchema.set('timestamps', true);// It will add createdAt, updatedAt time stamps

userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}
userSchema.methods.generateJWT = function () {
    return jwt.sign({ userName: this.userName, email: this.email }, 'secretKey', { expiresIn: '2m' });
}
/**
 * Virtuals
 */
// userSchema
//     .virtual('password')
//     .set(function (password) {
//         this._password = password;
//         this.salt = this.makeSalt();
//         this.hashedPassword = this.encryptPassword(password);
//     })
//     .get(function () {
//         return this._password;
//     });
/**
 * Methods
 */
// userSchema.methods = {

//     resetPassword: function (password) {
//         this.salt = this.makeSalt();
//         this.hashedPassword = this.encryptPassword(password);
//     },

/**
 * Authenticate - check if the passwords are the same
 *
 * @param {String} plainText
 * @return {Boolean}
 * @api public
 */
// authenticate: function (plainText) {
//     return this.encryptPassword(plainText) === this.hashedPassword;
// },

/**
 * Make salt
 *
 * @return {String}
 * @api public
 */
// makeSalt: function () {
//     return crypto.randomBytes(16).toString('base64');
// },

/**
 * Encrypt password
 *
 * @param {String} password
 * @return {String}
 * @api public
 */
//     encryptPassword: function (password) {
//         if (!password || !this.salt) return '';
//         var salt = new Buffer.from(this.salt, 'base64');
//         return crypto.pbkdf2Sync(password, salt, 10000, 64, null).toString('base64');
//     }
// };

/**
 * Validations
 */

// Validate empty email
// userSchema
//     .path('email')
//     .validate(function (email) {
//         return email.length;
//     }, 'Email cannot be blank');

// Validate empty password
// userSchema
//     .path('hashedPassword')
//     .validate(function (hashedPassword) {
//         return hashedPassword.length;
//     }, 'Password cannot be blank');

// let validatePresenceOf = function (value) {
//     return value && value.length;
// };

/**
* Pre-save hook
*/
userSchema
    .pre('save', function (next) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(this.password, salt, (err, hash) => {
                console.log(this.password, salt);
                this.password = hash;
                this.salt = salt;
                next();
            })
        })
    });

// userSchema.post('save', function (savedUser) {
//     if (this.wasNew) {
//         console.log("Sending email verification token.")
//         // mailerService.sendConfirmationEmail(savedUser, this._password);
//     }
// });

// userSchema.methods.confirmEmail = function (callback) {
//     // Remove keychain and update email verified status
//     delete this.emailVerifyToken;
//     this.emailVerifyToken = '';
//     this.emailVerified = true;

//     this.save(callback);
// };

// Send forgot mail
// userSchema.methods.sendForgotEmail = function (cb) {

//     this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
//     var currentDate = new Date();
//     currentDate = currentDate.setDate(currentDate.getDate() + 1);
//     this.resetPasswordExpires = currentDate;

//     this.save(function (err, savedUser) {
//         if (!err) {
//             //mailerService.sendForgotEmail(savedUser);
//         }
//         cb(err, savedUser);
//     });
// };

// userSchema.methods.resetPasswordResetToken = function (callback) {
//     // Remove keychain and update email verified status
//     delete this.resetPasswordToken;

//     this.save(callback);
// };

// userSchema.index({ email: 1 });

// Validating input object while creating new object (other than mongo validation)
// function validateObject(inputObject) {
//     const schema = Joi.object().keys({
//         email: Joi.string().trim().min(5).max(100).required().email(),

//         firstName: Joi.string().trim().min(1).max(50).required(),
//         lastName: Joi.string().trim().min(1).max(50).required(),

//         countryCode: Joi.string().trim().min(2).required(),
//         phoneNumber: Joi.string().trim().min(10).required(),

//         roles: Joi.array().min(1).required().items(Joi.objectId()),
//         enterprise: Joi.objectId().required(),
//     }).unknown(true);

//     return Joi.validate(inputObject, schema);
// }

//userSchema.set('collection','user');

if (!mongoose.models['User']) {
    exports.User = mongoose.model('User', userSchema)
}
exports.User = mongoose.models['User'];
//exports.validateObject = validateObject;