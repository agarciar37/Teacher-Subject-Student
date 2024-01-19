// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";
import { TeacherModel, TeacherModelType } from "../db/teacher.ts";
import { Teacher } from "../types.ts";
import { getTeacherFromModel } from "../controllers/getTeacherFromModel.ts";

export const putTeacher = async (
    req: Request<{ id: string }, {}, TeacherModelType>,
    res: Response<Teacher | { error: unknown }>
) => {
    const id = req.params.id
    const {name, email, subjectsID } = req.body
    try{
        const teacher = await TeacherModel.findByIdAndUpdate(
            id,
            {name, email, subjectsID},
            {new:true, runValidators: true}
        )
        if (!teacher){
            res.status(404).send({ error: "Teacher not found" })
            return
        }
        const teacherResponse: Teacher = await getTeacherFromModel(teacher)
        res.status(200).json(teacherResponse).send()
    } catch (error){
        res.status(500).send(error)
    }
}