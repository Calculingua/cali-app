define(["./mpower"],function (mpower) {

  function sqrtm(A) {
    return mpower(A, 0.5);
  }

  sqrtm.shortHelp = "Computes the matrix square-root of the input.";
  sqrtm.help = "# sqrtm(A) \n \
Computes the primary square root of A: X such that X*X = A.\n\n";

  // create the namspace
  return sqrtm;
});