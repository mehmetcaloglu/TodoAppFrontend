"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import Link from "next/link";

export default function Login ()
{
  const [ username, setUsername ] = useState( "" );
  const [ password, setPassword ] = useState( "" );
  const router = useRouter();

  const handleSubmit = async ( e: React.FormEvent ) =>
  {
    e.preventDefault();
    try {
      const response = await axios.post( "http://127.0.0.1:5000/api/auth/login", {
        username,
        password,
      } );
      console.log( "Login successful:", response.data );
      debugger;
      Cookies.set( "token", response.data.token );
      router.push( "/todo" );
    } catch ( error ) {
      debugger;
      console.error( "Login failed:", error );
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-80" onSubmit={ handleSubmit }>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="mb-4">
          <input
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            value={ username }
            onChange={ ( e ) => setUsername( e.target.value ) }
            placeholder="Username"
          />
        </div>
        <div className="mb-6">
          <input
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            type="password"
            value={ password }
            onChange={ ( e ) => setPassword( e.target.value ) }
            placeholder="Password"

          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>
        <p className="text-center mt-4">
          Dont have an account? <Link href="/register" className="text-blue-500">Register</Link>
        </p>
      </form>
      <ToastContainer position="top-right" autoClose={ 5000 } hideProgressBar />
    </div>
  );
}
