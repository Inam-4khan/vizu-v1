import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useApp } from '../hooks/useApp';

/**
 * Example Protected Component demonstrating useAuth() and useApp() state management.
 * Shows conditional rendering based on isAuthenticated, state updates with updateUser,
 * login simulation, and theme/notification dispatching via useApp().
 */
export function ProtectedProfileExample() {
  const { user, isAuthenticated, isLoading, login, logout, updateUser } = useAuth();
  const { theme, toggleTheme, addNotification } = useApp();
  const [displayNameInput, setDisplayNameInput] = useState('');

  const handleSimulatedLogin = () => {
    login({
      id: 'usr_vizu_99',
      username: 'alex_persona',
      displayName: 'Alex Rivers',
      email: 'alex@vizu.app',
      persona: 'AR Creator & Proximity Streamer',
      ghostMode: false,
    });
    addNotification({
      title: 'Session Authenticated',
      message: 'Logged in as alex_persona',
      type: 'success',
    });
  };

  const handleUpdateName = (e) => {
    e.preventDefault();
    if (!displayNameInput.trim()) return;
    updateUser({ displayName: displayNameInput.trim() });
    addNotification({
      title: 'Profile Updated',
      message: `Updated display name to ${displayNameInput.trim()}`,
      type: 'info',
    });
    setDisplayNameInput('');
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center rounded-3xl bg-white/10 backdrop-blur-md border border-white/10">
        <div className="animate-spin w-8 h-8 border-4 border-[#2EC4B6] border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-xs font-bold uppercase tracking-widest text-teal-300">
          Authenticating Persona...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6 rounded-3xl bg-[#062B34] border border-[#2EC4B6]/30 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#80FFEC]">🔒 Protected Vizu Persona Area</h3>
            <p className="text-xs text-white/70">Please log in to access your spatial profile data.</p>
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
            Unauthenticated
          </span>
        </div>

        <button
          onClick={handleSimulatedLogin}
          className="w-full py-3 px-4 rounded-2xl bg-[#2EC4B6] text-[#062B34] font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md"
        >
          Sign In to Vizu Persona
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl bg-[#062B34] border border-[#2EC4B6]/40 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2EC4B6] animate-pulse" />
            <h3 className="text-lg font-bold text-[#80FFEC]">{user?.displayName || user?.username}</h3>
          </div>
          <p className="text-xs text-white/60">@{user?.username} • {user?.email}</p>
        </div>
        <button
          onClick={() => {
            logout();
            addNotification({ title: 'Logged Out', message: 'Signed out of session', type: 'warning' });
          }}
          className="py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs active:scale-95 transition-all"
        >
          Logout
        </button>
      </div>

      {/* User Details & App State status */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] uppercase font-bold text-teal-300/70 block">Persona Badge</span>
          <span className="font-semibold">{user?.persona}</span>
        </div>
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] uppercase font-bold text-teal-300/70 block">App Theme</span>
          <div className="flex items-center justify-between mt-0.5">
            <span className="font-semibold uppercase">{theme}</span>
            <button
              onClick={toggleTheme}
              className="text-[10px] underline text-[#80FFEC] hover:text-white"
            >
              Toggle
            </button>
          </div>
        </div>
      </div>

      {/* Update User Form Example using updateUser() */}
      <form onSubmit={handleUpdateName} className="space-y-3 pt-2">
        <label className="block text-xs font-bold text-white/80">Update Display Name</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={displayNameInput}
            onChange={(e) => setDisplayNameInput(e.target.value)}
            placeholder="Enter new display name..."
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#2EC4B6]"
          />
          <button
            type="submit"
            className="py-2 px-4 rounded-xl bg-[#2EC4B6] text-[#062B34] font-bold text-xs uppercase hover:brightness-110 active:scale-95 transition-all"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
