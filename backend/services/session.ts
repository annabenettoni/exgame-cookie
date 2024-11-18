import DB from "./db";
import { Session } from "../../api-types";
import { getMockLoggedUser } from "../mock/mockLoggedUser";

const sessionSchema = new DB.Schema({
  exam_id: { type: String, required: true },
  student_class: { type: String, required: true },
  start_date: { type: Date, required: true },
  start_time: { type: Date, required: true },
});

const sessionModel = DB.model("session", sessionSchema);

export const getSessions = async (examId: string) => {
    const loggedUser = await getMockLoggedUser();

    switch (loggedUser.role) {
      case "teacher":
        return sessionModel.find({ exam_id: examId });
      case "student":
        return sessionModel.find({ exam_id: examId }).where({
          student_class: loggedUser.student_class
        });
    }
};

export const addSession = async (session: Session) => {
  const sessionDocument = new sessionModel(session);
  return sessionDocument.save();
};
