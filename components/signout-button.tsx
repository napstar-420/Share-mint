import { IoLogOutOutline } from 'react-icons/io5'
import { logout } from '@/app/actions'

export function SignOut() {
  return (
    <form action={logout} className="w-full h-full">
      <button
        type="submit"
        className="w-full flex justify-between items-center"
      >
        Sign out <IoLogOutOutline />
      </button>
    </form>
  )
}
