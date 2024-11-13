import { Request, Response } from "express";
import userModel from "../model/userModel";
import cloudinary from "../utils/cloudinary";
import gallaryModel from "../model/imageGallaryModel";
import https from "node:https";
import axios from "axios";
import env from "dotenv";

env.config();

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
    console.log(req.body);
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
    const {
      name,
      option,
      optionPicked,
      pickedAt,
      time,
      point,
      school,
      stage,
      correct,
      questionID,
    } = req.body;
    //
    if (user) {
      const getResult = await userModel.findById(userID);

      const check = getResult?.stage1Result.some(
        (el: any) => el.questionID === questionID
      );

      if (check) {
        let getData = getResult?.stage1Result.find(
          (el: any) => el.questionID === questionID
        );
        // console.log("first approch: ", getData);

        getData = {
          name,
          option,
          optionPicked,
          pickedAt,
          time,
          point,
          school,
          stage,
          correct,
          questionID,
        };

        let x: any = getResult?.stage1Result.filter(
          (el: any) => el.questionID !== questionID
        );

        x.push(getData);

        const dataArray: any = await userModel.findByIdAndUpdate(
          userID,
          {
            stage1Result: x,
          },
          { new: true }
        );

        const readResult = await userModel.findByIdAndUpdate(
          userID,
          {
            stage1Score: dataArray?.stage1Result
              .map((el: any) => el.point)
              .reduce((a: number, b: number) => {
                return a + b;
              }, 0),
          },
          { new: true }
        );

        return res.status(201).json({
          message: "result entered",
          data: readResult,
          status: 201,
        });
      } else {
        const updated = await userModel.findByIdAndUpdate(
          userID,
          {
            stage1Result: [
              ...user?.stage1Result,
              {
                questionID,
                name,
                option,
                optionPicked,
                pickedAt,
                time,
                point,
                school,
                stage,
                correct,
              },
            ],
          },
          { new: true }
        );

        await userModel.findByIdAndUpdate(
          userID,
          {
            stage1Score: updated?.stage1Result
              .map((el: any) => el.point)
              .reduce((a: number, b: number) => {
                return a + b;
              }, 0),
          },
          { new: true }
        );
        return res.status(201).json({
          message: "result entered",
          data: updated,
          status: 201,
        });
      }
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
    const {
      name,
      option,
      pickedAt,
      optionPicked,
      time,
      point,
      school,
      stage,
      correct,
      questionID,
    } = req.body;
    //
    if (user) {
      const getResult = await userModel.findById(userID);

      const check = getResult?.stage2Result.some(
        (el: any) => el.questionID === questionID
      );

      if (check) {
        let getData = getResult?.stage2Result.find(
          (el: any) => el.questionID === questionID
        );

        getData = {
          name,
          option,
          pickedAt,
          time,
          point,
          school,
          optionPicked,
          stage,
          correct,
          questionID,
        };

        let x: any = getResult?.stage2Result.filter(
          (el: any) => el.questionID !== questionID
        );

        x.push(getData);

        const data = await userModel.findByIdAndUpdate(
          userID,
          {
            stage2Result: x,
          },
          { new: true }
        );

        const readResult = await userModel.findByIdAndUpdate(
          userID,
          {
            stage2Score: data?.stage2Result
              .map((el: any) => el.point)
              .reduce((a: number, b: number) => {
                return a + b;
              }, 0),
          },
          { new: true }
        );

        return res.status(201).json({
          message: "result entered",
          data: readResult,
          status: 201,
        });
      } else {
        const updated: any = await userModel.findByIdAndUpdate(
          userID,
          {
            stage2Result: [
              ...user?.stage2Result,
              {
                questionID,
                name,
                option,
                pickedAt,
                optionPicked,
                time,
                point,
                school,
                stage,
                correct,
              },
            ],
          },
          { new: true }
        );

        await userModel.findByIdAndUpdate(
          userID,
          {
            stage2Score: updated?.stage2Result
              .map((el: any) => el.point)
              .reduce((a: number, b: number) => {
                return a + b;
              }, 0),
          },
          { new: true }
        );
        return res.status(201).json({
          message: "result entered",
          data: updated,
          status: 201,
        });
      }
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
    const {
      name,
      option,
      pickedAt,
      optionPicked,
      time,
      point,
      school,
      stage,
      correct,
      questionID,
    } = req.body;
    //
    if (user) {
      const getResult = await userModel.findById(userID);

      const check = getResult?.stage3Result.some(
        (el: any) => el.questionID === questionID
      );

      if (check) {
        let getData = getResult?.stage3Result.find(
          (el: any) => el.questionID === questionID
        );

        getData = {
          name,
          option,
          pickedAt,
          optionPicked,
          time,
          point,
          school,
          stage,
          correct,
          questionID,
        };

        let x: any = getResult?.stage3Result.filter(
          (el: any) => el.questionID !== questionID
        );

        x.push(getData);

        const data = await userModel.findByIdAndUpdate(
          userID,
          {
            stage3Result: x,
          },
          { new: true }
        );

        const readResult = await userModel.findByIdAndUpdate(
          userID,
          {
            stage3Score: data?.stage3Result
              .map((el: any) => el.point)
              .reduce((a: number, b: number) => {
                return a + b;
              }, 0),
          },
          { new: true }
        );

        return res.status(201).json({
          message: "result entered",
          data: readResult,
          status: 201,
        });
      } else {
        const updated: any = await userModel.findByIdAndUpdate(
          userID,
          {
            stage3Result: [
              ...user?.stage3Result,
              {
                questionID,
                name,
                option,
                pickedAt,
                optionPicked,
                time,
                point,
                school,
                stage,
                correct,
              },
            ],
          },
          { new: true }
        );

        await userModel.findByIdAndUpdate(
          userID,
          {
            stage3Score: updated?.stage3Result
              .map((el: any) => el.point)
              .reduce((a: number, b: number) => {
                return a + b;
              }, 0),
          },
          { new: true }
        );

        return res.status(201).json({
          message: "result entered",
          data: updated,
          status: 201,
        });
      }
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
    const {
      name,
      option,
      pickedAt,
      time,

      optionPicked,
      point,
      school,
      stage,
      correct,
      questionID,
    } = req.body;
    //

    if (user) {
      const getResult = await userModel.findById(userID);

      const check = getResult?.stage4Result.some(
        (el: any) => el.questionID === questionID
      );

      if (check) {
        let getData = getResult?.stage4Result.find(
          (el: any) => el.questionID === questionID
        );

        getData = {
          name,
          option,
          optionPicked,
          pickedAt,
          time,
          point,
          school,
          stage,
          correct,
          questionID,
        };

        let x: any = getResult?.stage4Result.filter(
          (el: any) => el.questionID !== questionID
        );

        x.push(getData);

        const data = await userModel.findByIdAndUpdate(
          userID,
          {
            stage4Result: x,
          },
          { new: true }
        );

        const readResult = await userModel.findByIdAndUpdate(
          userID,
          {
            stage4Score: data?.stage4Result
              .map((el: any) => el.point)
              .reduce((a: number, b: number) => {
                return a + b;
              }, 0),
          },
          { new: true }
        );

        return res.status(201).json({
          message: "result entered",
          data: readResult,
          status: 201,
        });
      } else {
        const updated: any = await userModel.findByIdAndUpdate(
          userID,
          {
            stage4Result: [
              ...user?.stage4Result,
              {
                questionID,
                name,
                option,
                pickedAt,
                optionPicked,
                time,
                point,
                school,
                stage,
                correct,
              },
            ],
          },
          { new: true }
        );

        await userModel.findByIdAndUpdate(
          userID,
          {
            stage4Score: updated?.stage4Result
              .map((el: any) => el.point)
              .reduce((a: number, b: number) => {
                return a + b;
              }, 0),
          },
          { new: true }
        );
        return res.status(201).json({
          message: "result entered",
          data: updated,
          status: 201,
        });
      }
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
    console.log("KKK");
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

export const deleteSingleAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const users = await userModel.findByIdAndDelete(userID);

    return res.status(200).json({
      message: "delete single user",
      data: users,
      status: 200,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error deleting account",
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

export const addImageGallary = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    const { title } = req.body;
    const { secure_url, public_id }: any = await cloudinary.uploader.upload(
      req.file.path
    );

    const userAccount = await gallaryModel.create({
      image: secure_url,
      imageID: public_id,
      title,
    });

    return res.status(201).json({
      message: "image Gallary added successfully",
      data: userAccount,
      status: 201,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error adding image Gallary",
      data: error,
    });
  }
};

export const addManyImageGallary = async (req: any, res: Response) => {
  try {
    const { title } = req.body;

    console.log(req?.files);

    for (let i of req?.files) {
      const { secure_url, public_id }: any = await cloudinary.uploader.upload(
        i.path
      );

      await gallaryModel.create({
        image: secure_url,
        imageID: public_id,
        title,
      });
    }
    return res.status(201).json({
      message: "image Gallary added successfully",
      status: 201,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error adding image Gallary",
      data: error,
    });
  }
};

export const gallaryView = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const gallary = await gallaryModel.find();

    return res.status(201).json({
      message: "get all gallary",
      data: gallary,
      status: 200,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Errorgetting gallary",
      data: error,
    });
  }
};

// let APP_URL_DEPLOY = "http://localhost:8080";
let APP_URL_DEPLOY = "https://just-next-gen.web.app";

export const makePayment = async (req: Request, res: Response) => {
  try {
    const { email, amount } = req.body;
    let token = "thank-you";

    const params = JSON.stringify({
      email,
      amount: (amount * 100).toString(),
      callback_url: `${APP_URL_DEPLOY}/${token}/successful-payment`,
      metadata: {
        cancel_action: `${APP_URL_DEPLOY}`,
      },
      channels: ["card"],
    });

    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/transaction/initialize",
      method: "POST",
      headers: {
        Authorization: `Bearer sk_test_c9f764c9d687cf28275c9cd131eb835393e87df6`,
        "Content-Type": "application/json",
      },
    };
    // ${process.env.APP_PAYSTACK}
    const request = https
      .request(options, (response: any) => {
        let data = "";

        response.on("data", (chunk: any) => {
          data += chunk;
        });

        response.on("end", () => {
          return res.status(201).json({
            message: "processing payment",
            data: JSON.parse(data),
            status: 201,
          });
        });
      })
      .on("error", (error: any) => {
        console.error(error);
      });

    request.write(params);
    request.end();
  } catch (error: any) {
    return res.status(404).json({
      message: "Error",
      data: error.message,
      status: 404,
    });
  }
};

export const verifyTransaction = async (req: Request, res: Response) => {
  try {
    const { ref } = req.params;

    const url: string = `https://api.paystack.co/transaction/verify/${ref}`;

    await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${process.env.APP_PAYSTACK}`,
        },
      })
      .then((data) => {
        return res.status(200).json({
          message: "payment verified",
          status: 200,
          data: data.data,
        });
      });
  } catch (error: any) {
    res.status(404).json({
      message: "Errror",
      data: error.message,
    });
  }
};
