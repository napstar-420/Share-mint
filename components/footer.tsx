import { CONFIG } from '@/app/config'
import Link from 'next/link'

export function Footer() {
  return (
    <div className="border-t py-4 mt-4 flex justify-between items-center">
      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()}{' '}
        <Link href="https://zohaib.codes" className="underline">
          Zohaib Khan
        </Link>
      </p>
      <div>
        <Link
          href={CONFIG.ROUTE.PRIVACY_POLICY}
          className="text-sm text-muted-foreground underline mr-4"
        >
          Privacy Policy
        </Link>
        <Link
          href={CONFIG.ROUTE.TERMS_OF_SERVICE}
          className="text-sm text-muted-foreground underline"
        >
          Terms of Service
        </Link>
      </div>
    </div>
  )
}
