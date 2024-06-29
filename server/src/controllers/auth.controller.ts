import { makeId } from "lib/IdGen";
import JsonResponse from "lib/Response";
import { User } from "models/User.model";
import { Controller } from "types/controller";
import bcrypt from "bcrypt";
import {TLoginRequest, TSignupRequest} from "@shared/api/authApi.type";
import jwt from "jsonwebtoken";
import { TUser } from "types/models/user.type";


const expiresIn = 60 * 60 * 24 * 14 * 1000;
const options = { maxAge: expiresIn, httpOnly: false };

const generateToken = (user_id: string) => jwt.sign({ user_id }, process.env.USER_SESSION_JWT||"", { expiresIn: '10d' });

export const signupUser: Controller = async(req, res) => {
    const jsonResponse = new JsonResponse(res);
    try {
        
        const { password, ...restBody } = req.body as TSignupRequest;
        const username = restBody.username.toLowerCase();
        restBody.username = restBody.username.toLowerCase()
        if(username.length < 3) return jsonResponse.clientError("Username should be more than 3 letters") 
        const foundUser = await User.findOne({username});
        if(foundUser) return jsonResponse.clientError("Username already taken");
        if(!password) return jsonResponse.clientError("Please enter password");
        if(password.length < 8) return jsonResponse.clientError("Password should be more than 8 charecters");
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({
            is_verified: false,
            user_id: makeId(),
            password: hashedPassword,
            ...restBody
        }) 
        await user.save();
        const savedUser = user.toJSON() as any;
        delete savedUser.password;
        delete savedUser.email;
        const token = generateToken(user.user_id);
        res.cookie("session", token, options);
        jsonResponse.success(savedUser);
    } catch (error) {
        console.log(error);
        jsonResponse.serverError();
    }
}

export const loginUser: Controller = async (req, res) => {
    const jsonResponse = new JsonResponse(res);
    try {
        const {username, password} = req.body as TLoginRequest;
        const user = await User.findOne({username});
        if(!user) return jsonResponse.clientError("No user found");
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return jsonResponse.clientError('Invalid password');
        }
        const token = generateToken(user.user_id);
        res.cookie("session", token, options);
        const savedUser = user.toJSON() as any;
        delete savedUser.password;
        delete savedUser.email;
        jsonResponse.success(savedUser);
    } catch (error) {
        console.log(error);
        jsonResponse.serverError();
    }
}

export const getLoginStatus: Controller = async(req, res) => {
    const jsonResponse = new JsonResponse(res);
    try {
        jsonResponse.success(res.locals.user);
    } catch (error) {
        console.log(error);
        jsonResponse.serverError();
    }
}

//middleware
export const authenticateUser: Controller = async(req, res, next) => {
    const jsonResponse = new JsonResponse(res);
    try {
        const token = req.cookies.session;
        if(!token) return jsonResponse.notAuthorized();
        const { user_id } = jwt.verify(token, process.env.USER_SESSION_JWT||"") as any;
        console.log(jwt.verify(token, process.env.USER_SESSION_JWT||"") as any)
        if(!user_id) return jsonResponse.notAuthorized();
        const user = await User.findOne({user_id}).select("-password -email");
        if(!user) return jsonResponse.clientError("User not found");
        res.locals.user = user.toJSON();
        next?.();
    }catch(error){
        console.log(error);
        jsonResponse.serverError();
    }
}

export const checkAccountSetup: Controller = async(req, res, next) => {
    const jsonResponse = new JsonResponse(res);
    try {
        const user = res.locals.user as TUser;
        if(!user.account_setup) return jsonResponse.notAuthorized("Please setup your account");
        next?.();
    } catch (error) {
        console.log(error);
        jsonResponse.serverError();
    }
}