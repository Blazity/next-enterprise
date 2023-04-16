"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isomorphic_unfetch_1 = require("isomorphic-unfetch");
function fetch(url, options = {}) {
    return (0, isomorphic_unfetch_1.default)(url, Object.assign({}, options));
}
exports.default = fetch;
//# sourceMappingURL=fetch.js.map