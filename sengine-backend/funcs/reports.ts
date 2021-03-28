/* eslint-disable class-methods-use-this */
import { NextFunction, Response } from "express";
import { NewRequest as Request } from "../types/types";
import userReport from "../models/userReport";
import utilReport from "../models/utilReport";
import initLogger from "../config/logger";

const logger = initLogger("ControllerReport");

export default class ReportController {
  // create util report (check author, check if already reported)
  async createutilReport(req: Request, res: Response) {
    const { reason, util } = req.body;
    const reportedBy = req.user._id;
    utilReport
      .findOne({
        reportedBy,
        util,
      })
      .then((p) => {
        if (p) {
          return res.status(400).json({
            success: false,
            message: "you have already reported this util",
          });
        } else {
          utilReport
            .create({
              reportedBy,
              reason,
              util,
            })
            .then(() =>
              res
                .status(201)
                .json({
                  success: true,
                  message: "Successfully submitted report",
                })
            )
            .catch((err) => {
              if (err.message.toLowerCase().includes("validation"))
                return res
                  .status(400)
                  .json({ success: false, message: err.message });
              logger.error(
                `Error saving util report for util ${util} by user ${reportedBy} with error: ${err}`
              );
              return res.status(500).json({ success: false, message: err });
            });
        }
      });
  }

  // create user report (check author, check if already reported)
  async createUserReport(req: Request, res: Response) {
    const { reason, user } = req.body;
    const reportedBy = req.user._id;

    utilReport
      .findOne({
        reportedBy,
        user,
      })
      .then((p) => {
        if (p) {
          return res.status(400).json({
            success: false,
            message: "you have already reported this user",
          });
        } else {
          userReport
            .create({
              reportedBy,
              reason,
              user,
            })
            .then(() =>
              res
                .status(201)
                .json({
                  success: true,
                  message: "Successfully submitted report",
                })
            )
            .catch((err) => {
              if (err.message.toLowerCase().includes("validation"))
                return res
                  .status(400)
                  .json({ success: false, message: err.message });
              logger.error(
                `Error saving user report for user ${user} by user ${reportedBy} with error: ${err}`
              );
              return res.status(500).json({ success: false, message: err });
            });
        }
      });
  }
}
