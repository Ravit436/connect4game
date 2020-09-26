const Joi               = require('joi');
const constants         = require('./constants');
const responseMessage  = require('./responseMessage');

exports.isPerformActionValid = isPerformActionValid;

function isPerformActionValid(req, res, next) {
    let options = req.body;

    let schema = Joi.object().keys({
        action: Joi.string().valid(["START"]).optional(),
        column: Joi.number().integer().min(0).max(constants.columns - 1).optional(),
    })
    .xor('action', 'column');

    let result = Joi.validate(options, schema);

    if(result.error) {
        console.error(result.error);
        return res.send(responseMessage.INVALID_MOVE);
    }

    next();
}
