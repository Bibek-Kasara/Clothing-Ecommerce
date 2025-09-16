import { UserButton, useUser } from '@clerk/clerk-react';

export default function ProfilePage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.firstName}</h1>
      <UserButton />
    </div>
  );
}
