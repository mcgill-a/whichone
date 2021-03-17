// main.js
const inA = {
  spotify_id: 1234 /* create your moduleA dependencies in or before this line */,
};
const outA = {
  /* you can add export properties with null values to enforce your contract, for example if you are using typescript */
};
moduleA(inA, outA);

outA.public2();
outA.getData();

const inB = {
  window, // this is how you pass a host object to a module - never call a host object directly from your code
  document, // or you will not be able to unit test it
  undefined, // or you may use a host object someone else may have overwritten before it is available to you,
  A: outA, // now you can consume moduleA inside moduleB without resorting to globals
};
const outB = {};
moduleB(inB, outB);

// do something with outA or outB
