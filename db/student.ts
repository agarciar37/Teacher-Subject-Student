import mongoose from "mongoose";
import { Student } from "../types.ts";
import { SubjectModel } from "./subject.ts";

const Schema = mongoose.Schema;

const studentSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        subjectsID : [{ type: Schema.Types.ObjectId, required : true, ref: "Subject" }],
    },
    { timestamps: true }
);

//validate subjectsID
studentSchema
    .path("subjectsID")
    .validate(async function (subjectsID: mongoose.Types.ObjectId[]) {
        try {
            if (subjectsID.some((id) => !mongoose.isValidObjectId(id))) return false;

            const subjects = await SubjectModel.find({ _id: { $in: subjectsID } });
            return subjects.length === subjectsID.length;
        } catch (e) {
            return false;
        }
    })

studentSchema.path("email").validate(async function (value) {
    const studentWithSameEmail = await mongoose.models.Student.findOne({ email: value });
    return !studentWithSameEmail;
}, "An other student already has this email.");

studentSchema.pre("save", async function (next) {
    const studentWithSameEmail = await mongoose.models.Student.findOne({ email: this.email });
    if (studentWithSameEmail) {
        const error = new Error("An other student already has this email.");
        next(error);
    } else {
        next();
    }
});

export type StudentModelType = mongoose.Document & Omit<Student, "id" | "subjects"> & {
    subjectsID: mongoose.Types.ObjectId[];
};

export const StudentModel = mongoose.model<StudentModelType>("Student", studentSchema);