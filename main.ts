// @deno-types="npm:@types/express@4"
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { postSubject } from "./resolvers/postSubject.ts";
import { putSubject } from "./resolvers/putSubject.ts";
import { deleteSubject } from "./resolvers/deleteSubject.ts";
import { getSubjects } from "./resolvers/getSubjects.ts";
import { getSubject } from "./resolvers/getSubject.ts";
import { getTeachers } from "./resolvers/getTeachers.ts";
import { getTeacher } from "./resolvers/getTeacher.ts";
import { postTeacher } from "./resolvers/postTeacher.ts";
import { putTeacher } from "./resolvers/putTeacher.ts";
import { deleteTeacher } from "./resolvers/deleteTeacher.ts";
import { getStudents } from "./resolvers/getStudents.ts";
import { getStudent } from "./resolvers/getStudent.ts";
import { postStudent } from "./resolvers/postStudent.ts";
import { putStudent } from "./resolvers/putStudent.ts";
import { deleteStudent } from "./resolvers/deleteStudent.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  console.log("No mongo URL found");
  Deno.exit(1);
}

await mongoose.connect(MONGO_URL);
const app = express();
app.use(express.json());
app
  .get("/teachers", getTeachers)
  .get("/students", getStudents)
  .get("/subjects", getSubjects)
  .get("/teacher/:id", getTeacher)
  .get("/student/:id", getStudent)
  .get("/subject/:id", getSubject)
  .post("/teacher", postTeacher)
  .post("/student", postStudent)
  .post("/subject", postSubject)
  .put("/teacher/:id", putTeacher)
  .put("/student/:id", putStudent)
  .put("/subject/:id", putSubject)
  .delete("/teacher/:id", deleteTeacher)
  .delete("/student/:id", deleteStudent)
  .delete("/subject/:id", deleteSubject);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});