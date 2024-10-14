import { Request, Response } from "express";
import userModel from "../model/userModel";
import { streamUpload } from "../utils/streamifier";
import cloudinary from "../utils/cloudinary";

export const createAdminAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, email, password, schoolName, phoneNumber, avatar } = req.body;

    const userAccount = await userModel.create({
      name,
      email,
      password,
      schoolName,
      phoneNumber,
      avatar,
      status: "admin",
    });

    return res.status(201).json({
      message: "Admin Account created",
      data: userAccount,
      status: 201,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating account",
      data: error,
    });
  }
};

export const createAccount = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      schoolName,
      phone,
      presentClass,
    } = req.body;

    const { secure_url }: any = await cloudinary.uploader.upload(req.file.path);

    const userAccount = await userModel.create({
      firstName,
      lastName,
      email,
      password,
      schoolName,
      phone,
      avatar: secure_url,
      presentClass,
    });

    return res.status(201).json({
      message: "Account created",
      data: userAccount,
      status: 201,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating account",
      data: error,
    });
  }
};

export const loginAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const userAccount = await userModel.findOne({ email });

    if (userAccount) {
      if (userAccount.password === password) {
        return res.status(201).json({
          message: "Account created",
          data: userAccount,
          status: 201,
        });
      } else {
        return res.status(404).json({
          message: "Error with Password",
        });
      }
    } else {
      return res.status(404).json({
        message: "Error with Email",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating account",
      data: error,
    });
  }
};

export const stage1Score = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const user: any = await userModel.findById(userID);
    const { mark, question, option, correct, questionID } = req.body;
    if (user) {
      const updated = await userModel.findByIdAndUpdate(
        userID,
        {
          stage1Result: [
            ...user?.stage1Result,
            { mark, question, option, correct },
          ],
        },
        { new: true }
      );

      await userModel.findByIdAndUpdate(
        userID,
        {
          stage1Score: user?.stage1Result
            .map((el: any) => el.mark)
            .reduce((a: number, b: number) => {
              return a + b;
            }, 0),
        },
        { new: true }
      );

      return res.status(201).json({
        message: "Account created",
        data: updated,
        status: 201,
      });
    } else {
      return res.status(404).json({
        message: "user doesn't exist",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating account",
      data: error?.message,
    });
  }
};

export const stage2Score = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const user: any = await userModel.findById(userID);

    if (user) {
      const updated = await userModel.findByIdAndUpdate(
        userID,
        {
          stage2Result: [...user?.stage2Result, req.body],
        },
        { new: true }
      );

      await userModel.findByIdAndUpdate(
        userID,
        {
          stage2Score: user?.stage2Result
            .map((el: any) => el.mark)
            .reduce((a: number, b: number) => {
              return a + b;
            }, 0),
        },
        { new: true }
      );

      return res.status(201).json({
        message: "user score recorded successfully",
        data: updated,
        status: 201,
      });
    } else {
      return res.status(404).json({
        message: "user doesn't exist",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating account",
      data: error?.message,
    });
  }
};

export const stage3Score = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const user: any = await userModel.findById(userID);

    if (user) {
      const updated = await userModel.findByIdAndUpdate(
        userID,
        {
          stage3Result: [...user?.stage3Result, req.body],
        },
        { new: true }
      );

      await userModel.findByIdAndUpdate(
        userID,
        {
          stage3Score: user?.stage3Result
            .map((el: any) => el.mark)
            .reduce((a: number, b: number) => {
              return a + b;
            }, 0),
        },
        { new: true }
      );

      return res.status(201).json({
        message: "user score recorded successfully",
        data: updated,
        status: 201,
      });
    } else {
      return res.status(404).json({
        message: "user doesn't exist",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating account",
      data: error?.message,
    });
  }
};

export const stage4Score = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const user: any = await userModel.findById(userID);

    if (user) {
      const updated = await userModel.findByIdAndUpdate(
        userID,
        {
          stage4Result: [...user?.stage4Result, req.body],
        },
        { new: true }
      );

      await userModel.findByIdAndUpdate(
        userID,
        {
          stage4Score: user?.stage4Result
            .map((el: any) => el.mark)
            .reduce((a: number, b: number) => {
              return a + b;
            }, 0),
        },
        { new: true }
      );

      return res.status(201).json({
        message: "user score recorded successfully",
        data: updated,
        status: 201,
      });
    } else {
      return res.status(404).json({
        message: "user doesn't exist",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating account",
      data: error?.message,
    });
  }
};

export const userAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const users = await userModel.find();

    return res.status(201).json({
      message: "get all users",
      data: users,
      status: 200,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating account",
      data: error,
    });
  }
};

export const readSingleAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const users = await userModel.findById(userID);

    return res.status(200).json({
      message: "get single user",
      data: users,
      status: 200,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating account",
      data: error,
    });
  }
};

export const deleteUserAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const users = await userModel.findByIdAndDelete(userID);

    return res.status(201).json({
      message: "user Deleted",
      data: users,
      status: 201,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating account",
      data: error,
    });
  }
};
