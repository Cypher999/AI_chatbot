import { NextResponse,NextRequest } from "next/server";
import axios from "axios";
export async function middleware(req){
    if(req.nextUrl.pathname.startsWith('/admin')||
        req.nextUrl.pathname.startsWith('/user')){
        console.log(req.cookies.get)
        const token=req.cookies.get('auth-token')?.value||'';

        if(token==''){
            return NextResponse.redirect(new URL('/',req.url));
        }    
        else{        
            let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}auth`,{
                headers:{
                    Authorization:'bearer '+token
                }
            });
            response=response.data
            if(response.data==null){
                return NextResponse.redirect(new URL('/',req.url));
            }
            else{
                if(req.nextUrl.pathname.startsWith('/admin')){            
                    if(response.data.role=='admin'){
                        return NextResponse.next();
                    }
                    else if(response.data.role=='user'){
                        return NextResponse.redirect(new URL('/user',req.url));
                    }
                }
                else if(req.nextUrl.pathname.startsWith('/user')){
                    if(response.data.role=='user'){
                        return NextResponse.next();
                    }
                    else if(response.data.role=='admin'){
                        return NextResponse.redirect(new URL('/admin',req.url));
                    }
                }
            }
        }
    }
    
    return NextResponse.next();
}

export const config={
    matcher:[
        '/login',
        '/api/:path*',
        '/',
        '/admin/:path*',
    ]
}