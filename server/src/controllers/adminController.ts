import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import User from "../models/user";

// ========================
// GET /api/admin/users
// Returns all users (password excluded)
// ========================
export const getAllUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // .select("-password") = return everything EXCEPT password field
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ========================
// DELETE /api/admin/users/:id
// Deletes a user by ID
// ========================
export const deleteUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};