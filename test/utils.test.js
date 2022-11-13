import {deepClone, dfs, get} from "../src/lib/utils";

describe("utils", () => {
  
  let object = null;
  
  beforeEach(() => {
    object = {
      a: {
        b: {
          c: 30,
        },
        d: [{e: {f: 10}}],
      },
    };
  });
  
  afterEach(() => {
    object = null;
  });
  
  describe("get", () => {
    
    test("get(object, 'a.d[0].e.f') 等于 10", () => {
      expect(get(object, "a.d[0].e.f")).toBe(10);
    });
    
    test("get(object, 'a.b.c') 等于 30", () => {
      expect(get(object, "a.b.c")).toBe(30);
    });
    
    test("get(object, 'a.b.c.d') 等于 undefined", () => {
      expect(get(object, "a.b.c.d")).toBeUndefined();
    });
    
  });
  
  describe("deepClone", () => {
    
    test("修改原对象中的属性不会影响克隆出来的新对象", () => {
      const newObject = deepClone(object);
      object.a.b.c = 100;
      expect(newObject).not.toEqual(object);
    });
    
    test("修改原对象属性数组中对象的属性不会影响克隆出来的新对象", () => {
      const newObject = deepClone(object);
      object.a.d[0].e.f = 200;
      expect(newObject).not.toEqual(object);
    });
    
  });
  
  describe("dfs", () => {
    
    test("传入字段 c 等于 30", () => {
      expect(dfs(object, "c")).toBe(30);
    });
    
    test("传入字段 b 等于 {c: 30}", () => {
      expect(dfs(object, "b")).toEqual({c: 30});
    });
  });
});
