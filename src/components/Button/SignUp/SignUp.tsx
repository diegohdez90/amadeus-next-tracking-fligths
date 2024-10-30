'use client'
import { redirect } from 'next/navigation';

const onSingUp = async () => {
  redirect('signup')
}
const SignUp = () => <button onClick={onSingUp}>Sign Up</button>

export default SignUp