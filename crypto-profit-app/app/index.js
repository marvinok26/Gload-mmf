// app/index.js
import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to login page when accessing the root route
  return <Redirect href="/login" />;
}