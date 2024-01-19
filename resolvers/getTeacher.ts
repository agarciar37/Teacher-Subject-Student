// @deno-types="npm:@types/express@4"
import { Request, Response, request } from "express";
import { Teacher } from "../types.ts";
import { TeacherModel } from "../db/teacher.ts";
import { getTeacherFromModel } from "../controllers/getTeacherFromModel.ts";

export const getTeacher = async (
    req : Request<{ id: string}>,
    res : Response<Teacher | { error: unknown }>

) => {
    const id = req.params.id

    try{
        const teacher = await TeacherModel.findById(id).exec()
        if (!teacher){
            res.status(4).send({error : "Teacher not found"})
            return
        }
        const teacherResponse: Teacher = await getTeacherFromModel(teacher)
        res.status(200).json(teacherResponse).send()
    } catch (error){
        res.status(500).send(error)
    }
}