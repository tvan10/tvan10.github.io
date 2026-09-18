const presets = new Map([
  ["quickTrip", "Quick Trip"],
  ["classicRoadtrip", "Classic Roadtrip"],
  ["crossCountry", "Cross-Country"],
]);

const states = new Set("AL AZ AR CA CO CT DE DC FL GA ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY".split(" "));

function cityIsValid(city) {
  return city && typeof city.name === "string" && city.name.length > 0 && city.name.length <= 100
    && typeof city.stateCode === "string" && states.has(city.stateCode.toUpperCase())
    && typeof city.latitude === "number" && city.latitude >= 24.3963 && city.latitude <= 49.3844
    && typeof city.longitude === "number" && city.longitude >= -124.8489 && city.longitude <= -66.8854;
}

export function decodeTrip(url) {
  const parsed = new URL(url);
  if (parsed.pathname !== "/trip/v1/" || parsed.hash || [...parsed.searchParams.keys()].length !== 1) return null;
  const token = parsed.searchParams.get("trip");
  if (!token || token.length > 2048 || !/^[A-Za-z0-9_-]+$/.test(token)) return null;
  try {
    const bytes = Uint8Array.from(atob(token.replaceAll("-", "+").replaceAll("_", "/")), c => c.charCodeAt(0));
    const trip = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    if (!presets.has(trip.preset) || !cityIsValid(trip.start) || !cityIsValid(trip.destination)) return null;
    if (`${trip.start.name.trim().toLowerCase()}|${trip.start.stateCode.toUpperCase()}`
      === `${trip.destination.name.trim().toLowerCase()}|${trip.destination.stateCode.toUpperCase()}`) return null;
    return {
      preset: presets.get(trip.preset),
      start: `${trip.start.name}, ${trip.start.stateCode.toUpperCase()}`,
      destination: `${trip.destination.name}, ${trip.destination.stateCode.toUpperCase()}`,
    };
  } catch {
    return null;
  }
}
