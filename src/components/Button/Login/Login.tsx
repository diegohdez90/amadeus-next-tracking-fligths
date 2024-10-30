'use client'
import { redirect } from 'next/navigation';

const onLogin = async () => {
  redirect('signin')
}
const Login = () => <button onClick={onLogin}>Login</button>

export default Login