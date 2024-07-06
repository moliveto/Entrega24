import { expect } from "chai";
import supertest from "supertest";

const BASE_API_URL = "http://localhost:3000";
const productsRoute = "/api/products";

describe('Test the products router', () => {
  let requester;

  beforeEach(() => {
    requester = supertest(`${BASE_API_URL}`);
  });

  it("should GET /api/products create a pet successfully with code 200", async () => {
    const { statusCode, ok, _body } = await requester.get(`${productsRoute}`);

    expect(ok).to.be.true;
    expect(statusCode).to.eq(200);
    expect(_body.status).to.equal("success");
    expect(Array.isArray(_body.payload)).to.be.true;
  });

  it("should GET /api/products/:id create a pet successfully with code 200", async () => {
    const { statusCode, ok, _body } = await requester.get(`${productsRoute}/665279dbef449b4a054850c5`);

    expect(ok).to.be.true;
    expect(statusCode).to.eq(200);
    expect(_body.status).to.equal("success");
    expect(_body.payload._id).to.equal("665279dbef449b4a054850c5");
  });

});

