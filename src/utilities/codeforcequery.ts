import crypto from "crypto";


export async function ContestSubmission(username: string, apiKey:string, secret:string) : Promise<Response> {
  const from = 1;
  const count = 50000;
  const showUnofficial = true;
  const base_url = `https://codeforces.com/api/user.status?handle=${username}&count=${count}&from=${from}&showUnofficial=${showUnofficial}`;
  const timestamp = Math.round(new Date().getTime() / 1000);
  const rand = Math.random().toString(36).substring(2, 8);
  const apiSign = `${rand}/user.status?apiKey=${apiKey}&count=${count}&from=${from}&handle=${username}&showUnofficial=${showUnofficial}&time=${timestamp}#${secret}`;
  const apiSig = crypto.createHash("sha512").update(apiSign).digest("hex");
  const url = `${base_url}&apiKey=${apiKey}&time=${timestamp}&apiSig=${rand}${apiSig}`;
  
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });
  const data = await response.json();
  return data;
}