import { areaName, uniqueAreas } from '../src/domain/places';

test('area names lose their PIN codes', () => {
  expect(areaName('Electronics City · 560100')).toBe('Electronics City');
  expect(areaName('Gachibowli - 500032')).toBe('Gachibowli');
  expect(areaName('Banjara Hills (500034)')).toBe('Banjara Hills');
  expect(areaName('Kondapur PIN 500084')).toBe('Kondapur');
  expect(areaName('Sector 17')).toBe('Sector 17');
  expect(areaName('HSR Layout')).toBe('HSR Layout');
  expect(areaName(null)).toBe('');
});

test('one row per area name', () => {
  const list = [{ name: 'Gachibowli', pincode: '500032' }, { name: 'Gachibowli', pincode: '500046' }, { name: 'Kondapur', pincode: '500084' }];
  expect(uniqueAreas(list).map((l) => l.pincode)).toEqual(['500032', '500084']);
});
