import { logger } from "../utils";
import { GraphQLError } from "graphql";
import { JSEncrypt } from "nodejs-jsencrypt";

export enum CustomErrorCodes {
  BAD_USER_INPUT = "BAD_USER_INPUT",
  UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS",
  INVALID_MESSAGE_CODE = "INVALID_MESSAGE_CODE",
}

export const errorMsgs = {
  [CustomErrorCodes.BAD_USER_INPUT]: "Invalid argument value",
  [CustomErrorCodes.UNAUTHORIZED_ACCESS]: "Not authorized to use",
  [CustomErrorCodes.INVALID_MESSAGE_CODE]: "Message code is invalid",
};

export function checkLimitValue(limit?: number) {
  logger("Check for limit value started!");

  if (limit && limit <= 0) {
    throw new GraphQLError(errorMsgs[CustomErrorCodes.BAD_USER_INPUT], {
      extensions: {
        code: CustomErrorCodes.BAD_USER_INPUT,
        argumentName: "limit",
        reason: "statisfying limit <= 0",
      },
    });
  }
}

export function checkOffsetValue(offset?: number) {
  logger("Check for offset value started!");

  if (offset && offset < 0) {
    throw new GraphQLError(errorMsgs[CustomErrorCodes.BAD_USER_INPUT], {
      extensions: {
        code: CustomErrorCodes.BAD_USER_INPUT,
        argumentName: "offset",
        reason: "statisfying offset < 0",
      },
    });
  }
}

export function checkAuthorization(messageCode: string) {
  logger("Check for Authorization started!");

  if (messageCode) {
    const decrypt = new JSEncrypt();
    decrypt.setPrivateKey(process.env.RSA_PRIVATE_KEY);
    const message = decrypt.decrypt(messageCode);

    if (message !== process.env.MESSAGE_CODE) {
      throw new GraphQLError(errorMsgs[CustomErrorCodes.INVALID_MESSAGE_CODE], {
        extensions: {
          code: CustomErrorCodes.INVALID_MESSAGE_CODE,
        },
      });
    }
  } else {
    throw new GraphQLError(errorMsgs[CustomErrorCodes.UNAUTHORIZED_ACCESS], {
      extensions: {
        code: CustomErrorCodes.UNAUTHORIZED_ACCESS,
      },
    });
  }
}
