'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import SignUpForm from '@/components/form/SignUpForm';
import SignInForm from '@/components/form/LoginForm';

export default function TestLogin() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  return (
    <div className={`container ${isSignUpMode ? 'sign-up-mode' : ''}`}>
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
            <h3>New here?</h3>
            <p>
              <i className="mb-8">
                Today is a new day. It's your day. You shape it.
                <br />
                Sign up to start enjoying the DoDo app
              </i>
            </p>
            <Button
              variant="login"
              size="login"
              className="btn transparent bg-[#5995fd]"
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
            <h3>One of us?</h3>
            <p>
              <i className="mb-8">
                Today is a new day. It's your day. You shape it.
                <br />
                Sign in to start enjoying the DoDo app
              </i>
            </p>
            <Button
              variant="login"
              size="login"
              className="btn transparent bg-[#5995fd]"
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
  );
}
