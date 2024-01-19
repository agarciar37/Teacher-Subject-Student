import { StudentModelType } from "../db/student.ts";
import { SubjectModel } from "../db/subject.ts";
import { Student } from "../types.ts";
import { getSubjectFromModel } from "./getSubjectFromModel.ts";

export const getStudentFromModel = async (student : StudentModelType): Promise<Student> => {
    const {_id, name, email, subjectsID} = student;

    const subjects = await SubjectModel.find({_id: {$in: subjectsID}});

    return {
        id : _id.toString(),
        name, 
        email,
        subjects: await Promise.all(subjects.map(getSubjectFromModel))
    }
}