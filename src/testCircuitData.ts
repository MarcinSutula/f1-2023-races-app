export const testCircuit1 = {
  attributes: {
    name: "testCircuit1",
  },
  geometry: {
    spatialReference: {
      latestWkid: 3857,
      wkid: 102100,
    },
    x: 251283.79619999975,
    y: 5096643.108199999,
    latitude: 251283.79619999975,
    longitude: 5096643.108199999,
    get: function (arg: "x" | "y" | "latitude" | "longitude") {
      return this[arg];
    },
  } as any,
};
