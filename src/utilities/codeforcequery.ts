import crypto from "crypto";

// export const apiKey = "44cfcb065b39a1d98756b6d4335dacfb1274be38";
// export const secret = "0ce71e2af1be124c5f1c5d45a3ebef42dcc24a92";
function generateSecret(): string {
    return crypto.randomBytes(20).toString('hex');
  }
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