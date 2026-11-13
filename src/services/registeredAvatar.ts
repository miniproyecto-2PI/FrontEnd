export async function persistRegisteredAvatar(
  uid: string,
  authenticate: () => Promise<{ user: { uid: string }; token: string } | null>,
  upload: (token: string) => Promise<string>,
): Promise<string> {
  const session = await authenticate()
  if (!uid || session?.user.uid !== uid || !session.token.trim()) {
    throw new Error('No se pudo autenticar la cuenta recién registrada.')
  }

  const avatarUrl = await upload(session.token)
  const url = new URL(avatarUrl)
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('El servidor no devolvió una URL de imagen persistente.')
  }
  return avatarUrl
}
