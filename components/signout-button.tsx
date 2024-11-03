import { CONFIG } from "@/app/config"
import { signOut } from "@/auth"
import { IoLogOutOutline } from 'react-icons/io5'
 
export function SignOut() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut({ redirectTo: CONFIG.ROUTE.HOME })
      }}
      className="w-full h-full"
    >
      <button type="submit" className="w-full flex justify-between items-center">Sign out <IoLogOutOutline /></button>
    </form>
  )
}