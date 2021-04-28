import NodeCache from "node-cache";

class Cache {
  cache: NodeCache;
  constructor(ttlSeconds = 10) {
    console.log("ttlSeconds", ttlSeconds);
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
  }

  has(key) {
    return this.cache.has(key);
  }

  async get(key, storeFunction = undefined) {
    const value = this.cache.get(key);
    console.log("get", key, value);
    if (storeFunction) {
      return storeFunction().then((result) => {
        this.cache.set(key, result);
        return result;
      });
    } else {
      return Promise.resolve(value);
    }
  }

  del(keys) {
    this.cache.del(keys);
  }

  delStartWith(startStr = "") {
    if (!startStr) {
      return;
    }

    const keys = this.cache.keys();
    for (const key of keys) {
      if (key.indexOf(startStr) === 0) {
        this.del(key);
      }
    }
  }

  listAllKeys() {
    console.log("listAllKeys", this.cache.keys());
  }

  flush() {
    this.cache.flushAll();
  }
}

export default Cache;
