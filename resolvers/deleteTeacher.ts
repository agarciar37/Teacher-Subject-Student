// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";
import { TeacherModel } from "../db/teacher.ts";

export const deleteTeacher = async (
    req: Request<{ id: string }, {}>,
    res: Response<string |{ error: unknown }>
) => {
    const id = req.params.id
    const teacher = await TeacherModel.findByIdAndDelete(id).exec()
    if (!teacher){
        res.status(404).send({ error: "Teacher not found" })
        return
    }
    res.status(200).send("Teacher deleted")
}