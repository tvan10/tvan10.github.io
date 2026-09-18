import assert from "node:assert/strict";
import test from "node:test";
import { decodeTrip } from "../routeguesser/trip/v1/trip.mjs";

const payload = {
  preset: "classicRoadtrip",
  start: { name: "Boston", stateCode: "MA", latitude: 42.36, longitude: -71.06 },
  destination: { name: "Nashville", stateCode: "TN", latitude: 36.16, longitude: -86.78 },
};
const token = Buffer.from(JSON.stringify(payload)).toString("base64url");

test("valid trip is displayed", () => {
  assert.deepEqual(decodeTrip(`https://tvan10.github.io/routeguesser/trip/v1/?trip=${token}`), {
    preset: "Classic Roadtrip", start: "Boston, MA", destination: "Nashville, TN",
  });
});

test("wrong path, extra query, and invalid city are rejected", () => {
  assert.equal(decodeTrip(`https://tvan10.github.io/routeguesser/trip/v2/?trip=${token}`), null);
  assert.equal(decodeTrip(`https://tvan10.github.io/routeguesser/trip/v1/?trip=${token}&x=1`), null);
  assert.equal(decodeTrip(`https://tvan10.github.io/trip/v1/?trip=${token}`), null);
  const invalid = { ...payload, destination: { ...payload.destination, stateCode: "AK" } };
  assert.equal(decodeTrip(`https://tvan10.github.io/routeguesser/trip/v1/?trip=${Buffer.from(JSON.stringify(invalid)).toString("base64url")}`), null);
});
