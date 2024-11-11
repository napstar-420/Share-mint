

import { Button } from '@/components/ui/button';


export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center mb-6">
          <span className="text-primary-foreground bg-primary px-1">Upload</span>
          <span className="text-brand-primary">Mint</span>
        </h1>

        {/* Form */}
        <form className="space-y-6">
          {/* Subheading */}
          <p className="text-center text-lg">
            <span className="text-foreground">Sign In to experience </span>
            <span className="text-brand-primary font-semibold">ShareMint</span>
          </p>

          {/* Checkbox */}
          <div className="flex items-center">
            <input
              id="subscribe"
              type="checkbox"
              className="mr-2 border-border text-primary-foreground focus:ring-primary"
            />
            <label htmlFor="subscribe" className="text-muted-foreground">
              Subscribe to work under our condition/terms
            </label>
          </div>

          {/* Sign in with Google Button */}
          <Button
            type="button"
            className="w-full py-2 px-4 bg-brand-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-chart-2 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-opacity-75"
          >
            Sign in with Google
          </Button>
        </form>
      </div>
    </div>
  );
};




