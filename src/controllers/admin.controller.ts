import { autoInjectable } from "tsyringe";
import bcrypt from "bcrypt";
import AdminService from "../services/admin.service";
import BaseController from "./base.controller";
import { NextFunction, Request, Response } from "express";
import sendResponse from "../utils/sendResponse";
import sendEmail from "../utils/mailer";
import config from "config";
import { generateOTP } from "../utils/uniqueNumber";
import { generateEmailTemplateForOTP } from "../utils/emailTemplate";
import AdminSI from "../interfaces/admin.interface";

@autoInjectable()
export default class AdminController extends BaseController {
  service: AdminService;
  constructor(service?: AdminService) {
    super(service);
    this.service = service;
  }
  getAdminByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resource = await this.service.findOne({ email: req.body.email }, {});
      const successMessage = "success";
      sendResponse(res, 200, true, resource, successMessage);
    } catch (error) {
      next(error);
    }
  };
  createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check existing admin
      const adminList = await this.service.get();
      if (adminList.length > 1) {
        const message = "Admin already exists";
        sendResponse(res, 403, false, null, message);
        return;
      }

      // Generate OTP
      const otp = generateOTP();

      // Hash OTP
      const hash = await bcrypt.hash(otp, 10);

      // Add OTP-hash to admin ddocument
      req.body.verificationCode = hash;
      const resource = await this.service.post(req.body);

      // Remove OTP-hash from admin ddocument
      resource.verificationCode = null;
      const successMessage = "Admin created successfully";
      sendResponse(res, 200, true, resource, successMessage);
    } catch (error) {
      next(error);
    }
  };

  updateAdminByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const match = { email: req.body.email };
      const update = { verificationCode: req.body.verificationCode };
      const resource = (await this.service.findOneAndUpdate(match, update)) as AdminSI;
      if (!resource) {
        const message = "Invalid user";
        sendResponse(res, 403, false, null, message);
        return;
      }
      const successMessage = "Email updated successfully";
      sendResponse(res, 200, true, resource, successMessage);
    } catch (error) {
      next(error);
    }
  };
}
