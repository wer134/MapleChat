// 캐릭터 API (/character/*)
import { getApiBase, parseJsonSafe } from './apiBase';

const base = (path, name) =>
  fetch(`${getApiBase()}${path}?name=${encodeURIComponent(name)}`).then(async (r) => {
    const data = await parseJsonSafe(r);
    if (!r.ok) return Promise.reject(new Error(r.statusText));
    if (data === null) return Promise.reject(new Error('Empty or invalid response'));
    return data;
  });

export async function fetchBasic(name) {
  const res = await fetch(`${getApiBase()}/character/basic?name=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error('Character not found');
  const data = await parseJsonSafe(res);
  if (data === null) throw new Error('Empty or invalid response');
  return data;
}

export async function fetchEquipment(name) {
  return base('/character/equipment', name);
}

export async function fetchAndroidEquipment(name) {
  const res = await fetch(`${getApiBase()}/character/android-equipment?name=${encodeURIComponent(name)}`);
  return parseJsonSafe(res);
}

export async function fetchAbility(name) {
  return base('/character/ability', name);
}

export async function fetchPropensity(name) {
  return base('/character/propensity', name);
}

export async function fetchStat(name) {
  return base('/character/stat', name);
}

export async function fetchHyperStat(name) {
  return base('/character/hyper-stat', name);
}
