"use server";

import axios from "axios";

export async function getOrganizations(selectionToken: string) {
  if (!selectionToken || selectionToken === "undefined") {
	console.warn("error");
	}
	const res = await axios.post("http://localhost:3001/v1/api/auth/organization/options",
		selectionToken
  );
  console.log(res);
  return res;
}