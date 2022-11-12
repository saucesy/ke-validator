import {deepClone, findMembers, get} from "../src/utils";

describe("utils", () => {
  
  const object = {
    a: {
      b: {
        c: 30,
      },
      d: [{e: {f: 10}}],
    },
  };
  
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
  
  describe.only("findMembers", () => {
    
    class A {
      constructor() {
        this.nameA = "a";
      }
      
      validateA() {
      }
    }
    
    class B extends A {
      constructor() {
        super();
        this.nameB = "b";
      }
      
      validateB() {
      }
    }
    
    const b = new B();
    
    test("能够根据传入的filter函数筛选出指定的方法", () => {
      const filters = findMembers(b, {
        filter(field) {
          if (/^validate([A-Z]\w*)+$/.test(field)) {
            return true;
          }
        },
      });
      expect(filters).toEqual(["validateB", "validateA"]);
    });
    
    test("能够根据传入的filter函数筛选出指定的属性", () => {
      const filters = findMembers(b, {
        filter(field) {
          if (field.startsWith("name")) {
            return true;
          }
        },
      });
      expect(filters).toEqual(["nameA", "nameB"]);
    });
    
  });
});
