import { SignIn } from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/'; // Use 'from' if available, else default to home

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SignIn afterSignInUrl={redirectTo} /> {/* Redirect after sign-in */}
    </div>
  );
}
