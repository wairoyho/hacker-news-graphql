// @ts-nocheck

import { createNamespace } from "cls-hooked";

import Container from "../Container";

class TestService {
  parent;
  constructor(parent) {
    this.parent = parent;
  }

  getFoo() {
    return this.parent.foo;
  }
}

describe("Container", () => {
  it("should use proxy", () => {
    const namespace = createNamespace("foobar");
    const services = Container.create([], namespace);

    services.register("foo", "bar");

    expect(services.foo).toEqual(services.get("foo"));
  });

  it("should throw if service is undefined", () => {
    const namespace = createNamespace("foobar");
    const services = Container.create([], namespace);

    expect(() => services.foo).toThrow;
  });

  it("should create new container from an array of definitions", () => {
    const definitions = [
      {
        name: "parent",
        factory: () => {
          return {
            foo: "bar",
          };
        },
      },
      {
        name: "child",
        factory: TestService,
        dependencies: ["parent"],
      },
    ];

    const namespace = createNamespace("foobar");
    const services = Container.create(definitions, namespace);

    expect(services.parent.foo).toEqual("bar");
    expect(services.child.getFoo()).toEqual("bar");

    services.parent.foo = "bar2";

    expect(services.parent.foo).toEqual("bar2");
    expect(services.child.getFoo()).toEqual("bar2");
  });

  // it("should scope services", async () => {
  //   const singletons = [];

  //   const namespace = createNamespace("foobar");
  //   const services = Container.create([], namespace);

  //   services.register("scoped", () => "foo", null, { scoped: true });
  //   services.register("unscoped", () => "bar");

  //   const app = services.express;

  //   app.get("/", (req, res) => {
  //     singletons.push({
  //       scoped: req.app.get("services").scoped,
  //       unscoped: req.app.get("services").unscoped,
  //     });

  //     res.send("Ok");
  //   });

  //   await Promise.all([
  //     request(app).get("/").expect(200),

  //     request(app).get("/").expect(200),
  //   ]);

  //   expect(singletons[0].unscoped === singletons[1].unscoped).to.be.true;
  //   expect(singletons[0].scoped === singletons[1].scoped).to.be.false;
  // });
});
