define([
    './mType/HashTable',
    "./lib/linearmodel/Linearmodel",
    "./mType/CellArrayType",
    "./mType/HandleType",
    "./mType/TableType"], function (HashTable, Linearmodel, CellArrayType, HandleType, TableType) {


    return {
        deepSerialize: function deepSerialize(object) {

            if (typeof object === "boolean" ||
                typeof object === "number" ||
                typeof object === "string" ||
                object === null ||
                typeof object === "undefined") {
                return object;
            }

            var data, key;
            if ((
                object.type === "CATEGORICAL" ||
                object.type === "CELL_ARRAY" ||
                object.type === "HANDLE" ||
                object.type === "HASH_TABLE" ||
                object.type === "TABLE"
                )) {
                //accomodate original types as if they were just data
                //this is a work-around until #237
                return object;
            }

            if (typeof object.serialize === "function") {
                return object.serialize();
            }

            if (typeof object.length === "number") {
                data = [];
                for (key = 0; key < object.length; key += 1) {
                    data[key] = deepSerialize(object[key]);
                }
                if (typeof object.type !== "undefined") {//for all these types that inherit from Array.prototype
                    data.type = object.type;
                }
                return data;
            }


            if (typeof object === "object") {
                data = {};
                for (key in object) {
                    if (object.hasOwnProperty(key)) {
                        data[key] = deepSerialize(object[key]);
                    }
                }
                return data;
            }

        },
        serialize: function (obj) {
            return (typeof obj.serialize === "function") ? obj.serialize() : JSON.parse(JSON.stringify(obj));
        },
        deserialize: function deserialize(obj) {
            var out;
            if (typeof obj.type === "string") {
                switch (obj.type) {
                    case "CELL_ARRAY":
                        out = new CellArrayType(obj);
                        break;
                    case "HANDLE":
                        out = new HandleType(obj);
                        break;
                    case "TABLE":
                        for (var i = 0; i < obj.data.length; i++) {
                            obj.data[i] = deserialize(obj.data[i]);
                        }
                        out = new TableType(obj);
                        break;
                    case "LINEARMODEL":
                        out = Linearmodel.deserialize(obj);
                        break;
                    case "HASH_TABLE":
                        out = new HashTable(obj);
                        break;
                    default:
                        out = {};
                }
            } else {
                out = obj;
            }
            return out;
        }
    };

});