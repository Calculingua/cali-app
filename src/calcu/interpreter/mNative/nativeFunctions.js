define([
  "./getColumn",
  "./getByIndex",
  "./getProperty",
  "./setColumn",
  "./setProperty",
  "./Table",
  "./categories",
  "./categorical"], function (getColumn, getByIndex, getProperty, setColumn, setProperty, table, categories, categorical) {


  return {
    categorical: categorical,
    categories: categories,
    getByIndex: getByIndex,
    getColumn: getColumn,
    getProperty: getProperty,
    setColumn: setColumn,
    setProperty: setProperty,
    table: table
  };

});