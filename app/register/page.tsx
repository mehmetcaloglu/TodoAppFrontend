"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register ()
{
    const [ username, setUsername ] = useState( "" );
    const [ password, setPassword ] = useState( "" );
    const router = useRouter();

    const handleSubmit = async ( e: React.FormEvent ) =>
    {
        e.preventDefault();
        try {
            const response = await axios.post( "http://127.0.0.1:5000/api/auth/register", {
                username,
                password,
            } );
            console.log( "Registration successful:", response.data );
            toast.success( "Registration successful. Please login." );
            setTimeout( () =>
            {
                router.push( "/login" );
            }, 2000 ); // 2 saniye bekledikten sonra login sayfasına yönlendir
        } catch ( error ) {
            console.error( "Registration failed:", error );
            toast.error( "Registration failed. Please try again." );
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form className="bg-white p-8 rounded shadow-md w-80" onSubmit={ handleSubmit }>
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
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
                    Register
                </button>
            </form>
            <ToastContainer position="top-right" autoClose={ 5000 } hideProgressBar />
        </div>
    );
}
