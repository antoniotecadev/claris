import { api } from '@/lib/api';
import { LoginResponse } from '@/types/auth.types'
import { create } from 'zustand'

type User = {
	id: string;
	email: string;
	displayName: string;
	avatarUrl?: string | null;
	gender?: string | null;
	birthDate?: string | null;
};

type UserStore = {
	user: User | null;
	loading: boolean;
	isAuthenticated: boolean;
	setUser: (user: User | null) => void;
	updateUser: () => Promise<void>;
	logout: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
	user: null,
	loading: false,
	isAuthenticated: false,

	setUser: (user) =>
		set({
			user,
			isAuthenticated: !!user,
		}),

	updateUser: async () => {
		try {
			set({ loading: true });

			const response = await api.get<User>("/me");

			set({
				user: response.data,
				isAuthenticated: true,
			});
		} catch (error) {
			set({
				user: null,
				isAuthenticated: false,
			});
		} finally {
			set({ loading: false });
		}
	},

	logout: () =>
		set({
			user: null,
			isAuthenticated: false,
		}),
}));