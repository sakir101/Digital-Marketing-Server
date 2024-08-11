
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";

import { ILoginUser, ILoginUserResponse } from "./auth.interface";
import { isPasswordMatched } from "./auth.utils";

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
    const { email, password } = payload;


    const isUserExist = await prisma.user.findFirst({
        where: {
            email: email
        }
    })

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User does not exist")
    }



    if (
        isUserExist.password &&
        !await isPasswordMatched(password, isUserExist.password)
    ) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect')
    }


    const { id: userId } = isUserExist

    let accessToken = ""
    let refreshToken = ""



    accessToken = jwtHelpers.createToken(
        { userId },
        config.jwt.user_secret as Secret,
        config.jwt.expires_in as string
    )

    refreshToken = jwtHelpers.createToken(
        { userId },
        config.jwt.user_refresh_secret as Secret,
        config.jwt.refresh_expires_in as string
    )





    return {
        accessToken,
        refreshToken
    }



}



export const AuthService = {
    loginUser
}