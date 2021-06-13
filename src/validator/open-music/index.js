const { OpenMusicPayloadSchema } = require("./schema");
const InvariantError = require("../../exceptions/InvariantError");

const OpenMusicValidator = {
  validateOpenMusicPayload: (payload) => {
    const validationResult = OpenMusicPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = OpenMusicValidator;
