export function checkOwnerAuth(request: Request): boolean {
  const auth = request.headers.get("authorization") ?? "";
  const phrase = auth.replace("Bearer ", "").trim();
  return !!phrase && phrase === process.env.OWNER_SECRET;
}
