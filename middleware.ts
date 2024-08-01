// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { NoAuthPaths } from "@/config/routes";

// 判断是否为静态资源请求
const isStaticFile = (pathname: string) => {
  const staticExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".svg",
    ".css",
    ".js",
    ".woff",
    ".woff2",
    ".ttf",
    ".eot",
    ".ico",
  ];
  return staticExtensions.some((ext) => pathname.endsWith(ext));
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token"); // 从 Cookie 中获取 token
  // 如果请求的是静态资源文件 和 _next 直接返回
  if (isStaticFile(pathname) || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }
  // 如果没有 token，则重定向到登录页面
  if (!NoAuthPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/public/login?redirect=${pathname}`, request.url)
      );
    }
  }
  // 允许请求继续
  return NextResponse.next();
}
