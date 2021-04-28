import { createNamespace, Namespace } from "cls-hooked";
import Express from "express";
import { v4 as uuid4 } from "uuid";

export default class Container {
  $services: Record<string, any>;
  $singletons: Record<string, any>;
  $ns: Namespace;
  static get proxy() {
    return {
      get(instance, property) {
        if (instance.$services.has(property)) {
          return instance.get(property);
        }

        return instance[property];
      },
    };
  }

  static create(definitions = [], namespace) {
    namespace = namespace || createNamespace(uuid4());

    const container = new Container(namespace);
    const express = Express();

    express.set("services", container);

    express.use((req, res, next) => {
      namespace.bindEmitter(req);
      namespace.bindEmitter(res);

      namespace.run(() => {
        next();
      });
    });

    definitions.forEach((definition) => {
      const { name, factory, dependencies, options } = definition;

      container.register(name, factory, dependencies, options);
    });

    container.register("express", () => express);

    return container;
  }

  constructor(namespace: Namespace) {
    this.$services = new Map();
    this.$singletons = new Map();
    this.$ns = namespace;

    return new Proxy(this, Container.proxy);
  }

  register(
    name,
    definition,
    dependencies: string[] | Object = [],
    options = {}
  ) {
    options = Object.assign(
      {
        singleton: true,
        scoped: false,
      },
      options
    );

    this.$services.set(name, {
      definition,
      dependencies,
      ...options,
    });
  }

  get(name) {
    const service = this.$services.get(name);

    if (!service) {
      throw new Error(`Service ${name} has not been registered`);
    }

    if (typeof service.definition === "function") {
      if (service.singleton) {
        let instance;

        if (service.scoped && this.$ns.active) {
          instance = this.$ns.get(name);

          if (!instance) {
            instance = this.factory(service);
            this.$ns.set(name, instance);
          }
        } else {
          instance = this.$singletons.get(name);

          if (!instance) {
            instance = this.factory(service);
            this.$singletons.set(name, instance);
          }
        }

        return instance;
      }

      return this.factory(service);
    }

    return service.definition;
  }

  resolveDepsInObject(service) {
    let deps = {};

    if (service.dependencies) {
      service.dependencies.map((dep) => {
        deps[dep] = this.get(dep);
      });
    }

    return deps;
  }

  resolveDepsInArray(service) {
    let deps = [];

    if (service.dependencies) {
      deps = service.dependencies.map((dep) => this.get(dep));
    }

    return deps;
  }

  resolveDeps(service) {
    let deps = [];

    if (service.dependencies) {
      if (Array.isArray(service.dependencies)) {
        deps = service.dependencies.map((dep) => this.get(dep));
      } else if (typeof service.dependencies === "object") {
        let depsObj = {};
        Object.values(service.dependencies as Object).map((dep) => {
          depsObj[dep] = this.get(dep);
        });
        deps.push(depsObj);
      }
    }

    return deps;
  }

  factory(service) {
    const Constructor = service.definition;

    if (
      typeof Constructor.prototype !== "undefined" &&
      Constructor.prototype.constructor
    ) {
      // return new Constructor(...this.resolveDepsInArray(service));
      // return new Constructor(this.resolveDepsInObject(service));
      return new Constructor(...this.resolveDeps(service));
    }

    return Constructor(...this.resolveDeps(service));
    // return Constructor(...this.resolveDepsInArray(service));
    // return Constructor(this.resolveDepsInObject(service));
  }

  reset() {
    this.$singletons = new Map();
  }
}
