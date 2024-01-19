// @deno-types="npm:@types/express@4"
import { Request, Response, request } from "express";
import { Student } from "../types.ts";
import { StudentModel } from "../db/student.ts";
import { getStudentFromModel } from "../controllers/getStudentFromModel.ts";

export const getStudent = async (
    req: Request<{ id: string }>,
    res: Response<Student | { error: unknown }>
) => {
    const id = req.params.id;
    try {
        const student = await StudentModel.findById(id).exec();
        if (!student) {
            res.status(404).send({ error: "Student not found" });
            return;
        }
        const studentResponse: Student = await getStudentFromModel(student);
        res.status(200).json(studentResponse).send();
    } catch (error) {
        res.status(500).send(error);
    }
};