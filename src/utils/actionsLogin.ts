"use server"
import axios from "axios";
import { redirect } from "next/navigation";
interface dataPros
{
	selectionToken:string
}
export async function loginAction(prevState: any, formData :FormData) {
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;

	const res : dataPros = await axios.post("http://localhost:3001/v1/api/auth/login", {

			email,
			password,
	})
	const data =  await res;
	console.log(data);
	if (!data?.selectionToken) {
  		console.warn("error");
	}
	redirect(`/dashboard/${data.selectionToken}`);
	return {success : true}
}