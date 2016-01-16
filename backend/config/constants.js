function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("MONGO_URL", 'mongodb://localhost:27017');

define("MONGO_URL_TEST_DB", 'mongodb://localhost:27017/test');

define("JSON_STATUS_SUCCESS", 1);
define("JSON_STATUS_WARNING", -1);
define("JSON_STATUS_NOTICE", 0);
define("JSON_STATUS_ERROR", -2);

define("JWT_SECRET", "jfhsfhdsffsfjgfsefjskisfhuksdjg");

