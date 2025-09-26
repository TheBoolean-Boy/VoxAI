import { db } from "@/server/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";


export default async function syncuser  ()  {
  const {userId} = await auth()
  if(!userId) throw new Error("Unauthorized")
  
  const client = await clerkClient()
  const user = await client.users.getUser(userId)

  if(!user.emailAddresses[0]?.emailAddress){
    return notFound()
  }

  try {
    await db.user.upsert({
      where:{
        id: userId
      },
      update:{
        imageUrl: user.imageUrl,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      create:{
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        emailAddress: user.emailAddresses[0]?.emailAddress!,
      }
    })
  } catch (error) {
    console.log("Error is syncing user to the database ", error)
    throw new Error("Something went wrong")
  }
  
  return redirect("/dashboard")
}


