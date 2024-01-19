import { SubjectModel } from "../db/subject.ts";
import { TeacherModelType } from "../db/teacher.ts";
import { Teacher } from "../types.ts";

export const getTeacherFromModel = async (teacher : TeacherModelType): Promise<Teacher> => {
    const { _id, name, email, subjectsID } = teacher;

    const subjects = await SubjectModel.find({ _id: { $in: subjectsID } });

    return {
        id : _id.toString(),
        name,
        email,
        subjects : subjects.map((subject) => ({
            id : subject._id.toString(),
            name : subject.name,
            year : subject.year,
            students : []
        }))
    }
}