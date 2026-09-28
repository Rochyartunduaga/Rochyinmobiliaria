import { NextResponse } from "next/server";
import { handleContact } from "@/lib/contact";

/** Endpoint JSON para integraciones externas. El formulario del sitio usa la Server Action. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  const result = await handleContact(body);
  const status = result.ok ? 200 : result.reason === "invalid" ? 400 : 502;
  return NextResponse.json(result, { status });
}
