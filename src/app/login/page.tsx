'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { DEMO_PASSWORD, DEMO_USERNAME } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!signIn(username, password)) {
      setError('That username or password does not match the demo account. Try again.');
      return;
    }
    router.replace('/');
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-border/80 bg-card p-6 shadow-xs space-y-5"
      >
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
            N
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Northstar Family Health</h1>
          <p className="text-sm text-muted-foreground">Sign in to the billing demo</p>
        </div>

        <label className="block space-y-1.5 text-sm">
          <span className="font-medium">Username</span>
          <input
            name="username"
            autoComplete="username"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
              setError('');
            }}
            className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm"
          />
        </label>

        <label className="block space-y-1.5 text-sm">
          <span className="font-medium">Password</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError('');
            }}
            className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm"
          />
        </label>

        {error && (
          <p className="text-sm text-rose-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
        >
          Sign in
        </button>

        <div className="rounded-lg border border-border/70 bg-muted/40 px-3 py-2 text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">Demo account</p>
          <p>Username {DEMO_USERNAME}</p>
          <p className="break-all">Password {DEMO_PASSWORD}</p>
        </div>
      </form>
    </div>
  );
}
