import { signIn } from '@/auth'
import { CONFIG } from '@/app/config'

export default function Login() {
  return (
    <form
      action={async () => {
        'use server'
        await signIn('google', { redirectTo: CONFIG.ROUTE.HOME })
      }}
    >
      <button type="submit">Login with Google</button>
    </form>
  )
}
