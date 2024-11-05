import Image from "next/image";
import SVGIMG from "@/404.svg";
import { BackgroundGrid } from "@/components/background-grid";
import Link from "next/link";
import { CONFIG } from "@/config"; // Adjusted alias

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col lg:flex-row items-center justify-center">
      <BackgroundGrid />

      {/* Left Half */}
      <div className="flex flex-col items-center justify-center text-center p-8 lg:w-1/2">
        <h1 className="text-6xl font-bold text-brand-primary">404</h1>
        <h2 className="text-2xl font-semibold mt-4 text-secondary-foreground">
          Page Not Found
        </h2>
        <p className="mt-2 text-secondary-foreground">
          This page could not be reached at this moment.
        </p>
        <Link
          className="mt-6 px-6 py-2 bg-brand-primary text-secondary-foreground rounded-lg hover:bg-brand-primary-hover transition duration-200"
          href={CONFIG.ROUTE.HOME}
        >
          Go Back Home
        </Link>
      </div>

      {/* Right Half */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-8">
        <Image
          src={SVGIMG}
          alt="Error Illustration"
          width={400}
          height={400}
          className="max-w-full h-auto"
        />
      </div>
    </div>
  );
}
