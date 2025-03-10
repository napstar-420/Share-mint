import { CONFIG } from '@/app/config'
import { signIn } from '@/auth'
import { Button } from '@/components/ui/button'
import { BackgroundGrid } from '@/components/background-grid'
import { FaGoogle } from 'react-icons/fa'

export default function SignIn() {
  return (
    <div className="grid place-items-center w-full p-4">
      <BackgroundGrid />
      <div className="bg-background border-brand-primary border-2 shadow-2xl px-12 py-12 rounded-3xl w-full sm:max-w-[448px] z-0">
        <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Share<span className="text-brand-primary">mint</span>
        </h1>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6">
          Sign in
        </h4>
        <p className="leading-7 mt-2 text-muted-foreground">
          to continue to <span className="font-semibold">sharemint</span>
        </p>
        <form
          action={async () => {
            'use server'
            await signIn('google', { redirectTo: CONFIG.ROUTE.HOME })
          }}
        >
          <Button
            type="submit"
            size="lg"
            className="font-semibold w-full mt-4"
            aria-label="Sign-in with Google"
          >
            <FaGoogle />
            Sign-in with Google
          </Button>
        </form>
      </div>
    </div>
  )
}
