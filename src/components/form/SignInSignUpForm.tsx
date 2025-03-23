'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import SignUpForm from '@/components/form/SignUpForm';
import SignInForm from '@/components/form/SignInForm';
import { Slide, ToastContainer } from 'react-toastify';

export default function SignInSignUpForm() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  return (
    <>
      <div className={`container ${isSignUpMode ? 'sign-up-mode' : ''}`}>
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Slide}
        />
        <div className="forms-container">
          <div className="signin-signup flex-1">
            <SignInForm />
            <SignUpForm setIsSignUpMode={setIsSignUpMode} />
          </div>
        </div>

        {/* Panel chuyển đổi */}
        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3 className="animate-bounce">First time here?</h3>
              <p className="mb-4 italic">
                <i>Every great journey begins with a single step.</i>
                <br />
                <i> Sign up today and start your DoDo experience!</i>
              </p>

              <Button
                variant="login"
                size="login"
                className="btn transparent animate-pulse bg-[#5995fd]"
                onClick={() => setIsSignUpMode(true)}
              >
                Sign up
              </Button>
            </div>
            <Image
              width={0}
              height={0}
              src="/images/register.svg"
              className="image"
              alt=""
            />
          </div>

          <div className="panel right-panel">
            <div className="content">
              <h3 className="animate-pulse">New here?</h3>
              <p className="mb-4">
                <i>
                  Today is a new day. It's your day. You shape it.
                  <br />
                  Sign in to start enjoying the DoDo app
                </i>
              </p>
              <Button
                variant="login"
                size="login"
                className="btn transparent animate-pulse bg-[#5995fd]"
                onClick={() => setIsSignUpMode(false)}
              >
                Sign in
              </Button>
            </div>
            <Image
              width={0}
              height={0}
              src="/images/log.svg"
              className="image"
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
}
