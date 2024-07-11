"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";

const inter = Inter( { subsets: [ "latin" ] } );



export default function RootLayout ( {
  children,
}: Readonly<{
  children: React.ReactNode;
}> )
{
  const [ loginSituationChecked, setLoginSituationChecked ] = useState( false );
  const router = useRouter();
  const pathname = usePathname();

  console.log( "Pathname:", pathname );
  useEffect( () =>
  {
    const token = Cookies.get( "token" );
    console.log( "Token:", token );
    if ( token == undefined && pathname !== "/register" ) {
      console.log( "No token, redirecting to login" );
      setLoginSituationChecked( true );
      console.log( "Redirecting to login" );
      router.push( "/login" );
    } else if ( token && pathname === "/" ) {
      console.log( "Token exists, redirecting to todo" );
      setLoginSituationChecked( true );
      router.push( "/todo" );
    }
    setLoginSituationChecked( true );
  }, [ pathname ] );

  return (
    <html lang="en">
      <body>{
        loginSituationChecked ? children : (
          <div className="flex justify-center items-center h-screen">
            <p className="text-2xl">Checking login situation...</p>
          </div>
        )
      }</body>
    </html>
  );
}
