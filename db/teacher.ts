import mongoose from "mongoose";
import { Teacher } from "../types.ts";
import { SubjectModel } from "./subject.ts";

const Schema = mongoose.Schema;

const teacherSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        subjectsID : [{ type: Schema.Types.ObjectId, required : true, ref: "Subject" }]
    },
    { timestamps: true }
);

// validate subjectsID
teacherSchema
    .path("subjectsID")
    .validate(async function (subjectsID: mongoose.Types.ObjectId[]) {
        try {
            if (subjectsID.some((id) => !mongoose.isValidObjectId(id))) return false;
            
            const subjects = await SubjectModel.find({ _id: { $in: subjectsID } });
            return subjects.length === subjectsID.length;
        } catch (e) {
            return false;
        }
    });

teacherSchema.path("email").validate(async function (value) {
    const teacherWithSameEmail = await mongoose.models.Teacher.findOne({ email: value });
    return !teacherWithSameEmail;
}, "An other teacher already has this email.");
    
teacherSchema.pre("save", async function (next) {
    const teacherWithSameEmail = await mongoose.models.Teacher.findOne({ email: this.email });
    if (teacherWithSameEmail) {
        const error = new Error("An other teacher already has this email..");
        next(error);
    } else {
        next();
    }
});

export type TeacherModelType = mongoose.Document & Omit<Teacher, "id" | "subjects" > & {
    subjectsID: Array<mongoose.Types.ObjectId>
};

export const TeacherModel = mongoose.model<TeacherModelType>("Teacher", teacherSchema);