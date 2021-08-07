import { derived, writable } from 'svelte/store';
import { supabase } from '../supabase';
import type { User } from '@supabase/supabase-js';
import type { Writable } from 'svelte/store';
import type { BookName } from './bible/RawTypes';
import type { subscribe } from 'svelte/internal';

function createAuthStore() {
	const { subscribe, set, update } = writable(supabase.auth.user());

	return {
		subscribe,
		set,
		update,
		async signIn({ email, password }: { email: string; password: string }) {
			const { user, session, error } = await supabase.auth.signIn({
				email,
				password
			});

			if (error) throw error;

			let { error: error2 } = await supabase.from('profiles').upsert(
				{ username: email, id: user.id },
				{
					returning: 'minimal' // Don't return the value after inserting
				}
			);

			if (error2) throw error2;

			set(user);
		},
		async signOut() {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			set(await supabase.auth.user());
		},

		async signUp({ email, password }: { email: string; password: string }) {
			const { user, session, error } = await supabase.auth.signUp({
				email: email,
				password: password
			});

			if (error) throw error;

			let { error: error2 } = await supabase.from('profiles').upsert(
				{ username: email, id: user.id },
				{
					returning: 'minimal' // Don't return the value after inserting
				}
			);

			if (error2) throw error2;

			set(user);
		}
	};
}

export const authStore = createAuthStore();

export const profileStore = derived(authStore, async (user) => {
	if (!user) {
		return null;
	}

	let { data, error, status } = await supabase
		.from('profiles')
		.select(`username`)
		.eq('id', user.id)
		.single();

	if (error) throw error;

	return data as { username: string };
});

export const bibleProgressStore = writable<{ [key: string]: number }>(null);
