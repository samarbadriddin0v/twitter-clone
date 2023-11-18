import Notification from "@/database/notification.model";
import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mognoose";
import { NextResponse } from "next/server";

export async function GET(req: Request, route: { params: { userId: string } }) {
  try {
    await connectToDatabase();
    const { userId } = route.params;

    const notifications = await Notification.find({ user: userId }).sort({
      createdAt: -1,
    });

    await User.findByIdAndUpdate(userId, {
      $set: { hasNewNotifications: false },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  route: { params: { userId: string } }
) {
  try {
    await connectToDatabase();
    const { userId } = route.params;

    await Notification.deleteMany({ user: userId });

    await User.findByIdAndUpdate(
      userId,
      {
        $set: { hasNewNotifications: false },
      },
      { new: true }
    );

    return NextResponse.json({ message: "Notifications deleted" });
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
