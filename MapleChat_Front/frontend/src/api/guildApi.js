// 길드 API (/guild/*)

export async function fetchGuildBasic(guildName, worldName) {
  const params = new URLSearchParams({
    guildName: guildName.trim(),
    worldName: worldName.trim(),
  });
  const res = await fetch(`/guild/basic?${params}`);
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || '길드 정보를 불러올 수 없습니다.');
  }
  return res.json();
}
