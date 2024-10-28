'use client'
import dotenv from 'dotenv'
import { redirect } from 'next/navigation';

dotenv.config()

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const onLogout = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/logout`, { method: 'GET' });
    redirect('/')
  } catch (error) {
    console.error('Error calling logout API:', error);
  }}
const Logout = () => <button onClick={onLogout}>Logout</button>

export default Logout