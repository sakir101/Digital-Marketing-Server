import { User } from "@prisma/client";
import bcrypt from 'bcrypt';
import httpStatus from "http-status";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";

const createUser = async (userData: User): Promise<User> => {
    userData.password = await bcrypt.hash(
        userData.password,
        Number(config.bycrypt_salt_rounds)
    )
    const result = await prisma.user.create({
        data: userData
    })
    return result
}

const getSingleUser = async (id: string): Promise<User | null> => {
    const userInfo = await prisma.user.findFirst({
        where: {
            id
        }
    })

    if (!userInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found")
    }


    return userInfo;
}

export const UserService = {
    createUser,
    getSingleUser
}