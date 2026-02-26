// 캐릭터 API (/character/*)
import { getApiBase } from './apiBase';

const base = (path, name) =>
  fetch(`${getApiBase()}${path}?name=${encodeURIComponent(name)}`).then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))));

export async function fetchBasic(name) {
  const res = await fetch(`${getApiBase()}/character/basic?name=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error('Character not found');
  return res.json();
}

export async function fetchEquipment(name) {
  return base('/character/equipment', name);
}

export async function fetchAndroidEquipment(name) {
  const res = await fetch(`${getApiBase()}/character/android-equipment?name=${encodeURIComponent(name)}`);
  return res.ok ? res.json() : null;
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
