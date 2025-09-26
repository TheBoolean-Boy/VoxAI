
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";


export default async function Home() {
  const {userId} = await auth()
  return (
    <div className=" flex items-center justify-center h-screen">
      {
        userId? <Button className=" cursor-pointer">
        <Link href={'/dashboard'}>Go to Dashboard </Link>
      </Button> : <Button className=" cursor-pointer">
        <Link href={'/sign-up'}>SignUp</Link>
      </Button>
      }
      
    </div>
  );
}
