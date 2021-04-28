import sum from "@modules/test";

const addOneIfEven = (b: number) => {
  return b % 2 === 0 ? sum(1, b) : b;
};

export default addOneIfEven;
