import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getPostHogClient } from "@/lib/posthog-server";

export const runtime = "nodejs";

type Platform = "windows" | "macos" | "linux" | "freebsd" | "android" | "unknown";

function detectPlatform(userAgent: string): Platform {
  const ua = userAgent.toLowerCase();
  
  // Windows detection (PowerShell, cmd, Windows browsers)
  if (ua.includes("windows") || ua.includes("powershell") || ua.includes("win32") || ua.includes("win64")) {
    return "windows";
  }
  
  // macOS detection
  if (ua.includes("darwin") || ua.includes("macintosh") || ua.includes("mac os")) {
    return "macos";
  }
  
  // Android detection (before Linux, since Android includes "Linux")
  if (ua.includes("android")) {
    return "android";
  }
  
  // FreeBSD detection
  if (ua.includes("freebsd")) {
    return "freebsd";
  }
  
  // Linux detection
  if (ua.includes("linux") || ua.includes("x11")) {
    return "linux";
  }
  
  // curl default detection (curl usually identifies as "curl/version")
  // Most curl users are on Unix-like systems
  if (ua.includes("curl")) {
    return "linux";
  }
  
  // wget detection
  if (ua.includes("wget")) {
    return "linux";
  }
  
  // Invoke-WebRequest / Invoke-RestMethod from PowerShell
  if (ua.includes("windowspowershell") || ua.includes("powershell")) {
    return "windows";
  }
  
  return "unknown";
}

function detectPlatformFromQueryOrHeader(request: Request): Platform {
  const url = new URL(request.url);
  
  // Allow explicit platform override via query parameter
  const platformParam = url.searchParams.get("os")?.toLowerCase();
  if (platformParam) {
    if (platformParam === "windows" || platformParam === "win") return "windows";
    if (platformParam === "macos" || platformParam === "mac" || platformParam === "darwin") return "macos";
    if (platformParam === "linux") return "linux";
    if (platformParam === "freebsd") return "freebsd";
    if (platformParam === "android") return "android";
  }
  
  // Detect from User-Agent header
  const userAgent = request.headers.get("user-agent") || "";
  return detectPlatform(userAgent);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lang = url.searchParams.get("lang");
  const platform = detectPlatformFromQueryOrHeader(request);
  const userAgent = request.headers.get("user-agent") || "";

  // PostHog: Track install script download (server-side)
  const posthog = getPostHogClient();

  // Generate a distinct ID from request characteristics for anonymous tracking
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "anonymous";
  const distinctId = `install_${clientIp}_${Date.now()}`;

  posthog.capture({
    distinctId,
    event: "install_script_downloaded",
    properties: {
      platform,
      language: lang || "auto",
      user_agent: userAgent,
      script_type: platform === "windows" ? "powershell" : "bash",
      $ip: clientIp !== "anonymous" ? clientIp : undefined,
    },
  });

  // Windows gets PowerShell script
  if (platform === "windows") {
    const scriptPath = join(process.cwd(), "start.ps1");
    const script = await readFile(scriptPath, "utf8");

    const injected = lang
      ? `# lang forced by server\n$env:LANG_OVERRIDE = ${JSON.stringify(lang)}\n\n${script}`
      : script;

    return new Response(injected, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "content-disposition": "inline; filename=install.ps1",
        "cache-control": "no-store",
        "x-detected-platform": platform,
      },
    });
  }

  // Unix-like systems (Linux, macOS, FreeBSD, Android, unknown) get Bash script
  const scriptPath = join(process.cwd(), "start.sh");
  const script = await readFile(scriptPath, "utf8");

  const injected = lang
    ? `# lang forced by server\nLANG_OVERRIDE=${JSON.stringify(lang)}\n\n${script}`
    : script;

  return new Response(injected, {
    headers: {
      "content-type": "text/x-shellscript; charset=utf-8",
      "content-disposition": "inline; filename=install.sh",
      "cache-control": "no-store",
      "x-detected-platform": platform,
    },
  });
}
