import { BsFillShieldLockFill } from 'react-icons/bs'

export default function UnAuthorized() {
  return (
    <div className="grid place-items-center h-screen w-full -z-10 absolute top-0 left-0 p-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="mb-6">
          <BsFillShieldLockFill className="text-8xl" />
        </span>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-brand-primary">
          Access denied
        </h1>
        <p>Sorry, you&apos;re not allowed to visit this page</p>
      </div>
    </div>
  )
}
