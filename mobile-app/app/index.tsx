import { Redirect } from 'expo-router';
import { useAuth } from '../src/hooks/auth/useAuth';

export default function Index() {
  const { user } = useAuth();

  return <Redirect href={user ? "/tasks" : "/login"} />;
}