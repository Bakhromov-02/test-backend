const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {signupValidate, loginValidate} = require('../middleware/validation');

exports.signup = async (req, res, next) => {
    const {error} = await signupValidate(req.body);
    if (error) {
        return res
            .status(400)
            .json({success: false, error: error.details[0].message});
    }

    const emailExists = await User.findOne({email: req.body.email});

    if (emailExists) {
        return res
            .status(400)
            .json({success: false, error: 'Email already exists!'});
    }

    const salt = await bcrypt.genSalt();
    const hashedPwd = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        email: req.body.email,
        password: hashedPwd
    });

    try {
        const savedUser = await user.save();
        res.status(201).json({success: true});
    } catch (error) {
        console.log(error)
    }
}

exports.login = async (req, res, next) => {
    let loadedUser;
    try {
        const {error} = await loginValidate(req.body);
        if (error) {
            return res
                .status(400)
                .json({success: false, error: error.details[0].message});
        }

        const user = await User.findOne({email: req.body.email});

        if (!user) {
            return res.status(400).json({
                success: false,
                error: "A user with this email could not be found.",
            });
        }
        loadedUser = user;

        const isEqual = await bcrypt.compare(req.body.password, loadedUser.password);

        if (!isEqual) {
            return res.status(400).json({
                success: false,
                error: "Wrong password!",
            });
        }

        const token = jwt.sign(
            {
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            },
            process.env.SECRET_KEY,
            {expiresIn: 3600}
        );

        res.status(200).json({
            success: true,
            token: token,
            userId: loadedUser._id.toString()
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}