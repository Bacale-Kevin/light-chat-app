import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    const body = await request.json();

    /** Create one to conversation or group chats
     *  userId is used for one to one conversations
     *  isGroup is used for group conversations
     * */
    const { userId, isGroup, members, name } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("UnAuthorize", { status: 401 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    //Create a group chat
    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          /**users will have both the members id and userid(loggedIn user id ) */
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              { id: currentUser.id },
            ],
          },
        },
        include: {
          users: true,
        },
      });

      newConversation.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(user.email, "conversation:new", newConversation);
        }
      });

      return NextResponse.json(newConversation);
    }

    const existingConversatios = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId], // conversation has only two userIds
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    const singleConversation = existingConversatios[0];

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    //Create new conversation
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [{ id: currentUser.id }, { id: userId }],
        },
      },
      include: {
        users: true,
      },
    });

    newConversation.users.map((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:new", newConversation);
      }
    });

    return NextResponse.json(newConversation);
  } catch (error: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
