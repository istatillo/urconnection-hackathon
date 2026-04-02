import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

import { GroupModel } from "../../models/group";
import { GroupMemberModel } from "../../models/group-member";
import { AuditLogModel } from "../../models/audit-log";
import { HttpException } from "../../utils/http.exception";
import { asyncHandler } from "../../middlewares/async-handler.middleware";
import { BOT_USERNAME } from "../../utils/secrets";

export class GroupController {
  public static create = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const teacherId = req.body.user._id;

    const invite_code = uuidv4().replace(/-/g, "").substring(0, 12);

    const group = await GroupModel.create({
      name,
      invite_code,
      teacher: teacherId,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: group,
    });
  });

  public static getAll = asyncHandler(async (req, res) => {
    const teacherId = req.body.user._id;

    const groups = await GroupModel.find({ teacher: teacherId }).sort({
      created_at: -1,
    });

    const groupsWithCount = await Promise.all(
      groups.map(async (group) => {
        const memberCount = await GroupMemberModel.countDocuments({
          group: group._id,
          status: "active",
        });
        return { ...group.toObject(), member_count: memberCount };
      }),
    );

    res.status(StatusCodes.OK).json({ success: true, data: groupsWithCount });
  });

  public static getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const teacherId = req.body.user._id;

    const group = await GroupModel.findOne({ _id: id, teacher: teacherId });
    if (!group) {
      throw new HttpException(
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
        "Guruh topilmadi!",
      );
    }

    const members = await GroupMemberModel.find({
      group: id,
      status: { $ne: "removed" },
    }).populate("student");

    res.status(StatusCodes.OK).json({
      success: true,
      data: { ...group.toObject(), members },
    });
  });

  public static update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const teacherId = req.body.user._id;
    const { name, status } = req.body;

    const group = await GroupModel.findOne({ _id: id, teacher: teacherId });
    if (!group) {
      throw new HttpException(
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
        "Guruh topilmadi!",
      );
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (status) updateData.status = status;

    await group.updateOne({ $set: updateData });

    res.status(StatusCodes.OK).json({ success: true });
  });

  public static freezeMember = asyncHandler(async (req, res) => {
    const { id, student_id } = req.params;
    const teacherId = req.body.user._id;

    const group = await GroupModel.findOne({ _id: id, teacher: teacherId });
    if (!group) {
      throw new HttpException(
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
        "Guruh topilmadi!",
      );
    }

    const member = await GroupMemberModel.findOne({
      group: id,
      student: student_id,
      status: "active",
    });
    if (!member) {
      throw new HttpException(
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
        "A'zo topilmadi!",
      );
    }

    await member.updateOne({ $set: { status: "frozen" } });

    await AuditLogModel.create({
      action: "freeze",
      performed_by: teacherId,
      target_student: student_id,
      old_value: "active",
      new_value: "frozen",
    });

    res.status(StatusCodes.OK).json({ success: true });
  });

  public static removeMember = asyncHandler(async (req, res) => {
    const { id, student_id } = req.params;
    const teacherId = req.body.user._id;

    const group = await GroupModel.findOne({ _id: id, teacher: teacherId });
    if (!group) {
      throw new HttpException(
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
        "Guruh topilmadi!",
      );
    }

    const member = await GroupMemberModel.findOne({
      group: id,
      student: student_id,
      status: { $ne: "removed" },
    });
    if (!member) {
      throw new HttpException(
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
        "A'zo topilmadi!",
      );
    }

    const oldStatus = member.status;
    await member.updateOne({ $set: { status: "removed" } });

    await AuditLogModel.create({
      action: "remove",
      performed_by: teacherId,
      target_student: student_id,
      old_value: oldStatus,
      new_value: "removed",
    });

    res.status(StatusCodes.OK).json({ success: true });
  });

  public static getInviteLink = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const teacherId = req.body.user._id;

    const group = await GroupModel.findOne({ _id: id, teacher: teacherId });
    if (!group) {
      throw new HttpException(
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
        "Guruh topilmadi!",
      );
    }

    const botUsername = BOT_USERNAME || "gradeai_bot";
    const invite_link = `https://t.me/${botUsername}?start=${group.invite_code}`;

    res.status(StatusCodes.OK).json({
      success: true,
      data: { invite_link, invite_code: group.invite_code },
    });
  });
}
