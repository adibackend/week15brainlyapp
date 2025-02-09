import bcrypt from 'bcrypt'
export async function hashpassword(plaintext:string):Promise<string>{
const saltRounds =10;
const hashp=await bcrypt.hash(plaintext,saltRounds)
return hashp
}
export async function comparepassword(pass:string,hpass:string):Promise<boolean>{
    const isMatch=await bcrypt.compare(pass,hpass)
    return isMatch;
}
export function random(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}
