import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { ProviderType, type IUser } from "./user.dto";

const Schema = mongoose.Schema;

export const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 12);
  return hash;
};

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String },
    active: { type: Boolean, required: false, default: true },
    role: {
      type: String,
      required: true,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    password: { type: String, select: false },
    refreshToken: { type: String, required: false, default: "", select: false },
    blocked: { type: Boolean, default: false },
    blockReason: { type: String, default: "" },
    provider: {
      type: String,
      enum: Object.values(ProviderType),
      default: ProviderType.MANUAL,
    },
    facebookId: { type: String, select: false },
    image: { type: String },
    linkedinId: { type: String, select: false },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.password) {
    this.password = await hashPassword(this.password);
  }
  next();
});

export default mongoose.model<IUser>("user", UserSchema);
