import * as React from 'react';
import { Button } from '@/components/ui/button';


const SignUp: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center mb-6">
          <span className="text-white">Upload</span>
          <span className="text-mint">Mint</span>
        </h1>

        

        {/* Form */}
        <form className="space-y-6">
          {/* Subheading */}
          <p className="text-center text-lg">
            <span className="text-black">Sign In to experience </span>
            <span className="text-mint font-semibold">ShareMint</span>
          </p>

          {/* Checkbox */}
          <div className="flex items-center">
            <input
              id="subscribe"
              type="checkbox"
              className="mr-2 border-gray-300 text-mint focus:ring-mint"
            />
            <label htmlFor="subscribe" className="text-gray-700">
              Subscribe to work under our condition/terms
            </label>
          </div>

          {/* Sign in with Google Button */}
          <Button
            type="button"
            className="w-full py-2 px-4 bg-mint text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
          >
            Sign in with Google
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
