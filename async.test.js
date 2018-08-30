const fetch = require('node-fetch');
const swapi = require('./async');

// TEST1
it('calls swapi to get people', () => {
  // นับจำนวน expect() ของ test นี้
  expect.assertions(1);

  /* ต้องใช้ประโยค return เพราะ .getPeople()
    เป็น async ถ้าไม่ return expect.assertions(1)
    จะไม่สามารถทำงานได้
  */
  return swapi
    .getPeople(fetch)
    .then(data => {
      expect(data.count).toEqual(87);
    });
});

// TEST2
// it('calls swapi to get people with a promise', () => {
//   expect.assertions(2);

//   return swapi
//     .getPeoplePromise(fetch)
//     .then(data => {
//       expect(data.count).toEqual(87);
//       expect(
//         data.results.length
//       ).toBeGreaterThan(5);
//     });
// });

/* เนื่องจาก fetch เป็น async ซึ่งถ้ามีหลายๆ test เรียกใช้
   มันจำทำงานช้าจึงสร้าง fetch ปลอมขึ้นมา ชื่อ mockFetch
   ใช้งานแทน TEST2
*/
it('getPeople returns count and results', () => {
  const mockFetch = jest
    .fn()
    .mockReturnValue(
      Promise.resolve({
        json: () =>
          Promise.resolve({
            count: 87,
            results: [0, 1, 2, 3, 4, 5]
          })
      })
    );

  expect.assertions(4);
  return swapi
    .getPeoplePromise(mockFetch)
    .then(data => {
      expect(
        mockFetch.mock.calls.length
      ).toBe(1);

      expect(mockFetch).toBeCalledWith(
        'https://swapi.co/api/people'
      );

      expect(data.count).toEqual(87);

      expect(
        data.results.length
      ).toBeGreaterThan(5);
    });
});
