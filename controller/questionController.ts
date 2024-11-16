import { Request, Response } from "express";
import userModel from "../model/userModel";
import testQuestionModel from "../model/testQuestionModel";
import { question } from "../question";

export const createQuestionByAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const userAccount = await userModel.findById(userID);

    if (userAccount?.status === "admin") {
      await testQuestionModel.deleteMany();

      const questionData = await testQuestionModel.create({
        question: question,
      });

      return res.status(201).json({
        message: "Admin Account created",
        data: questionData,
        status: 201,
      });
    } else {
      return res.status(403).json({
        message: "You are not authorized to create admin account",
        data: null,
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating account",
      data: error,
    });
  }
};

export const readQuestionByAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const users = await testQuestionModel.find();

    return res.status(201).json({
      message: "get all test question",
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

export const updateQuestionByAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID, mainID } = req.params;
    const { stage, questionID } = req.body;
    const user = await userModel.findById(userID);

    if (user) {
      const question: any = await testQuestionModel.find();

      await testQuestionModel.findByIdAndUpdate(
        mainID,
        {
          question: {
            ...question[0].question,
            [`${stage}`]: {
              data: question[0].question[`${stage}`]?.data?.map((el: any) => {
                if (el.id === questionID) {
                  el.start = true;
                }
                return el;
              }),
            },
          },
        },
        { new: true }
      );

      const read = question[0].question[`${stage}`]?.data?.filter((el: any) => {
        return el.start === true;
      });

      const specific = read?.find((el: any) => {
        return el.id === parseInt(questionID);
      });

      await testQuestionModel.findByIdAndUpdate(
        mainID,
        {
          specific: { ...specific, stage },
        },
        { new: true }
      );

      return res.status(201).json({
        message: "question updated successfully",
        read: question[0]?.specific,
        data: question,
        status: 201,
      });
    } else {
      return res.status(404).json({
        message: "You are not Authorized",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "Error ",
      data: error?.message,
    });
  }
};

export const readStageQuestionByAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { questionID, stage } = req.params;

    const question: any = await testQuestionModel.find();

    const read = question[0].question[`${stage}`].data.filter((el: any) => {
      return el.start === true;
    });

    const specific = read.find((el: any) => {
      return el.id === parseInt(questionID);
    });

    return res.status(200).json({
      message: "question updated successfully",
      specific,
      read,
      status: 200,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error ",
      data: error,
    });
  }
};
