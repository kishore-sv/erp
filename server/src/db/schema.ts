import { pgTable, uuid, varchar, boolean, timestamp, pgEnum, primaryKey, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["student", "faculty", "parent", "admin"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  profileImage: text("profile_image"),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: roleEnum("role").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  resetPasswordOtp: varchar("reset_password_otp", { length: 10 }),
  resetPasswordOtpExpiry: timestamp("reset_password_otp_expiry"),
});

export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  rollNumber: varchar("roll_number", { length: 50 }).notNull().unique(),
  profileImage: text("profile_image"),
  department: varchar("department", { length: 100 }),
  year: varchar("year", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const faculty = pgTable("faculty", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  profileImage: text("profile_image"),
  employeeId: varchar("employee_id", { length: 50 }).notNull().unique(),
  department: varchar("department", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const parents = pgTable("parents", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const parentStudent = pgTable(
  "parent_student",
  {
    parentId: uuid("parent_id")
      .notNull()
      .references(() => parents.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.parentId, t.studentId] }),
  })
);

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  student: one(students, {
    fields: [users.id],
    references: [students.userId],
  }),
  faculty: one(faculty, {
    fields: [users.id],
    references: [faculty.userId],
  }),
  parent: one(parents, {
    fields: [users.id],
    references: [parents.userId],
  }),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  parents: many(parentStudent),
}));

export const facultyRelations = relations(faculty, ({ one }) => ({
  user: one(users, {
    fields: [faculty.userId],
    references: [users.id],
  }),
}));

export const parentsRelations = relations(parents, ({ one, many }) => ({
  user: one(users, {
    fields: [parents.userId],
    references: [users.id],
  }),
  students: many(parentStudent),
}));

export const parentStudentRelations = relations(parentStudent, ({ one }) => ({
  parent: one(parents, {
    fields: [parentStudent.parentId],
    references: [parents.id],
  }),
  student: one(students, {
    fields: [parentStudent.studentId],
    references: [students.id],
  }),
}));
