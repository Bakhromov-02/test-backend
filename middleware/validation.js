const Joi = require('joi');

exports.signupValidate = async (data) => {
    const schema = Joi.object({
        email: Joi.string().required().trim().email(),
        password: Joi.string().required().trim().min(6).max(255),
        confirmPassword: Joi.string().required().trim().min(6).max(255),
    });

    return schema.validate(data);
};

exports.loginValidate = async (data) => {
    const schema = Joi.object({
        email: Joi.string().required().trim().email(),
        password: Joi.string().required().trim().min(6).max(255),
    });

    return schema.validate(data);
};

exports.createPostValidate = async (data) => {
    const schema = Joi.object({
        title: Joi.string().required().trim().min(6).max(255),
        content: Joi.string().required().trim().min(6),
        userId: Joi.string().required(),
        tags: Joi.array()
    });

    return schema.validate(data);
}