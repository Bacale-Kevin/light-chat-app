import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversations = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  try {
    //Get conversations excuded yourself
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          has: currentUser.id, //handles both group chats and indivituals chats
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true, 
          },
        },
      },
    });

    return conversations;
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
};

export default getConversations;
