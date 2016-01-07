function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("MONGO_URL", 'mongodb://localhost:27017');

define("MONGO_URL_TEST_DB", 'mongodb://localhost:27017/test');
