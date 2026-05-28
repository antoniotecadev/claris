import { api } from '@/lib/api';
import { LoginResponse } from '@/types/auth.types'
import { int } from 'zod';
import { create } from 'zustand'
import { persist } from 'zustand/middleware';

interface user
{
	id: string;
	displayName: string;
	email: string;
	avatarUrl?: string;
}

interface userStore
{
	user: user | null;
	authorized: boolean;
	setUser: (user: user | null) => void;
	logout: () => void;
}


export const useUserStore = create<userStore>()(
	persist(
		(set) => ({
			user: null,
			authorized: false,
			setUser: (user: user | null) => set({ user, authorized: true }),
			logout: () => set({ user: null, authorized: false }),
		}),
		{
			name: 'auth-storage',
		}
	)
)