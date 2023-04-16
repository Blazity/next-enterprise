"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_1 = require("./fetch");
const isomorphic_unfetch_1 = require("isomorphic-unfetch");
jest.mock("isomorphic-unfetch", () => jest.fn(() => Promise.resolve(isomorphic_unfetch_1.default)));
describe("fetch", () => {
    const url = "https://example.com";
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should make a GET request with default options", async () => {
        const response = await (0, fetch_1.default)(url);
        expect(response.ok).toBe(true);
        expect(response.status).toBe(200);
        expect(response.statusText).toBe("OK");
        expect(isomorphic_unfetch_1.default).toHaveBeenCalledWith(url, {});
    });
    it("should make a POST request with options", async () => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: "test" }),
        };
        const response = await (0, fetch_1.default)(url, options);
        expect(response.ok).toBe(true);
        expect(response.status).toBe(200);
        expect(response.statusText).toBe("OK");
        expect(isomorphic_unfetch_1.default).toHaveBeenCalledWith(url, Object.assign(Object.assign({}, options), { body: JSON.stringify({ data: "test" }) }));
    });
});
//# sourceMappingURL=fetch.test.js.map