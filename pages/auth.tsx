import React, { useCallback, useState } from "react";
import { signIn, getSession } from "next-auth/react"
import axios from "axios";
import Input from "@/components/Input";

import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { NextPageContext } from "next";

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

const Auth = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [variant, setVariant] = useState('login');

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login');
  }, [])

  const login = useCallback(async () => {
    try {
      await signIn('credentials', {
        email,
        password,
        callbackUrl: '/profiles',
      });
    } catch (error) {
      console.log(error)
    }
  }, [email, password]);

  const register = useCallback(async () => {
    try {
      await axios.post('/api/register', {
        email,
        name,
        password
      });

      login();
    } catch (error) {
      console.log(error)
    }
  }, [email, name, password, login]); // added the data fields to be in sync whatever changes the user do in useState. If not in the array dependency it will just a default of useState value.

  return (
    <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
      <div className="bg-black w-full h-full lg:bg-opacity-50">
        <nav className="px-12 py-5">
          <img src="/images/logo.png" alt="Logo" className="h-12" />
        </nav>
        <div className="flex justify-center">
          <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
            <h2 className="text-white text-4xl mb-8 font-semibold">{variant === 'login' ? 'Sign in' : 'Register'}</h2>
            <div className="flex flex-col gap-4">
              {variant === 'register' && (
                <Input 
                  id="name" 
                  onChange={(e: any) => setName(e.target.value)} 
                  value={name} 
                  label="Username" 
                />
              )}
              <Input 
                id="email" 
                onChange={(e: any) => setEmail(e.target.value)} 
                value={email} 
                label="Email" 
                type="email" 
              />
              <Input 
                id="password" 
                onChange={(e: any) => setPassword(e.target.value)} 
                value={password} 
                label="Password" 
                type="password" 
              />
            </div>
            <button onClick={variant === 'login' ? login : register} className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition">
              {variant === 'login' ? 'Login' : 'Sign up'}
            </button>
            <div className="flex flex-row item-center gap-4 mt-8 justify-center">
              <div 
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                onClick={() => signIn('google', { callbackUrl: '/profiles' })}
              >
                <FcGoogle size={30} />
              </div>
              <div 
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                onClick={() => signIn('github', { callbackUrl: '/profiles' })}
              >
                <FaGithub size={30} />
              </div>
            </div>
            {
              variant === 'login' ? (
                <p className="text-neutral-500 mt-12">
                  First time using Netflix?
                  <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">
                    Create an account
                  </span>
                </p>
              ) : (
                <p className="text-neutral-500 mt-12">
                  Already have an account?
                  <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">
                    Login
                  </span>
                </p>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth;