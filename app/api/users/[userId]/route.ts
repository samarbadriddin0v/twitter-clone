import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mognoose";
import { NextResponse } from "next/server";

export async function PUT(req: Request, route: { params: { userId: string } }) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { userId } = route.params;

    const isExistinUsername = await User.findOne({ username: body.username });

    if (isExistinUsername) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    await User.findByIdAndUpdate(userId, body, { new: true });

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
