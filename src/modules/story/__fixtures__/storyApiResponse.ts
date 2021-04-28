const entities = {
  "10001": {
    by: "user a",
    descendants: 7262,
    id: 10001,
    kids: [12000, 13000, 14000],
    score: 99,
    time: 1602259200,
    title: "taiwan number one",
    type: "story",
    url: "https://example.com",
  },
  "10002": {
    by: "user b",
    descendants: 62,
    id: 10002,
    kids: [12200, 13200, 14200],
    score: 77,
    time: 1602359200,
    title: "awesome title",
    type: "story",
    url: "https://example.com",
  },
  "10003": {
    by: "user c",
    descendants: 55,
    id: 10003,
    kids: [12300, 13300, 14300],
    score: 12,
    time: 1602269200,
    title: "ccccccccccccccccccc",
    type: "story",
    url: "https://example.com",
  },
};

export const getById = (id: string) => {
  const data = entities[id];

  return data ? { data } : null;
};

export const getList = (type) => {
  return { data: Object.values(entities).map((item) => item.id) };
};

const storyApiResonse = {
  getById,
  getList,
};

export default storyApiResonse;
