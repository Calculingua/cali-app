define(['./mtimes'], function (mtimes) {

  function mldivide(A, B) {
    var inv = numeric.inv;
    return mtimes(inv(A), B);
  }

  mldivide.shortHelp = "Solves a system of linear equations.";
  mldivide.help = "# mldivide(A, B) \n \
Solve systems of linear equations Ax = B for x.\n\n";

  return mldivide;
});