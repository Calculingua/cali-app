define([],function () {

  function rng(seed) {

    numeric.seedrandom.seedrandom(seed[0][0]);

    return null;
  }

  rng.shortHelp = "Sets the seed value of the random number generator.";
  rng.help = "# rng(seed) \n \
rng(seed), sets the seed value of the random number generator.  This enables repeat random experiments.\n\n";

  return rng;
});