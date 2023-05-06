import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0/client';
import React from 'react';
import { withPageAuthRequired } from "@auth0/nextjs-auth0";


const User = () => {
  const { push } = useRouter();
  const { isLoading, user, error } = useUser();
  
  const loginHandler = () => push('/api/auth/login');
  const logoutHandler = () => push('/api/auth/logout');

  user ? console.log(user) : console.log("Nothing yet");

  if (isLoading) {
    return (<h1>Loading...</h1>);
  }

  return (
    <React.Fragment>
      { user ? (
        <React.Fragment>
      <div className="flex flex-col items-center justify-center w-full overflow-hidden mt-20">
            <center><h1>Welcome: {user.name}</h1></center>
            <br/>
            <div>
            {user.picture && <img src={user.picture} alt="User Avatar" className="mx-auto" />}
            </div>
            <br/>
            <center><button onClick={logoutHandler}>Logout</button></center>
        </div>
        </React.Fragment>
      ) : (
        <center><button onClick={loginHandler}>Login</button></center>
      )}
    </React.Fragment>
  );
};

export default User;
export const getServerSideProps = withPageAuthRequired()

