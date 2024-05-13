import { TestBed } from '@angular/core/testing';
import { FilterSortService } from './filter-sort.service';
import { SortOptions } from './../options/sort-options';
import { FilterOptions } from './../options/filter-options';
import { Comparator } from './../comparators/comparator';
import { FilterComparator } from './../comparators/filter-comparator';
import { SortComparator } from './../comparators/sort-comparator';
import { SortDirection } from '../options/sort-direction';
import { MatchType } from '../comparators/match-type';

describe('FilterSortService', () => {
  let service: FilterSortService;

  let sortOptions: SortOptions;
  let secondarySortOptions: SortOptions;
  let filterOptions: FilterOptions;
  let secondaryFilterOptions: FilterOptions;

  const arrForCompare: any[] = [
    {
      id: 1,
      person: {
        name: 'Mickey Mouse',
        nickname: 'Mick',
        age: 92,
        birthday: null,
        isMale: true,
        data: [1, 2, 3],
        gifts: ['roses']
      }
    },
    {
      id: 0,
      person: {
        name: 'Goofy',
        nickname: 'Goof',
        age: 92,
        birthday: null,
        isMale: true,
        data: null,
        gifts: ['doggie bones', 'umbrellas']
      }
    },
    {
      id: 2,
      person: {
        name: 'Minnie Mouse',
        nickname: 'Míní',
        age: 92,
        birthday: null,
        isMale: false,
        data: '',
        gifts: ['chocolate']
      }
    },
    {
      id: 3,
      person: {
        name: 'Bob Smith',
        nickname: 'Bobby',
        age: 44,
        birthday: null,
        isMale: true,
        data: 5,
        gifts: ['pie']
      }
    },
    {
      id: 4,
      person: {
        name: 'John Doe',
        nickname: 'Mr. Joey',
        age: 64,
        birthday: null,
        isMale: true,
        data: { occupation: 'Bus Driver' },
        gifts: ['cake']
      }
    }
  ];

  const truthyAndFalsyArrForCompare: any[] = [
    false,
    0,
    -0,
    "",
    '5',
    '',
    ``,
    null,
    [],
    NaN,
    undefined,
    document.all
  ];

  const stringArrForCompare: any[] = [
    'adam',
    'daine',
    'Donna',
    24,
    12,
    '024',
    '12',
    'àbraham',
    'Amos'
  ];
  const stories: any = [
    {
      title: 'The Dog Who "Loved" Water',
      author: 'Last.Name? First.name?',
      description: `[Abridged version] A big brown dog stepped into a warm river and went for a swim. (He swam slowly).  How happy was the dog?  Dogs should be happy. His name was Fido, wasn't it?`
    },
    {
      title: 'A Hot Dog Is a Sandwich',
      author: 'William Shakespeare',
      description: `
        A hot dog is a sandwich
        Prove me wrong
        Two pieces of bread
        Does a sandwich belong
      `
    },
    {
      title: 'A Dog Eat Dog World',
      author: 'Snoopy Dog',
      description: 'snoopy looks for hot dogs to eat.'
    }
  ];
  const wordsWithPunctuation: string[] = [
    ',dog,',
    ':dog:',
    ';dog;',
    '[dog]',
    '{dog}',
    '(dog)',
    'dog\'',
    '"dog"',
    '...dog...',
    '…dog…',
    '....dog....',
    '?dog?',
    '.dog.',
    '!dog!',
    '-dog-',
    '—dog—',
    '@dog@',
    '#dog#',
    '$dog$',
    '%dog%',
    '^dog^',
    '&dog&',
    '*dog*',
    '_dog_',
    '+dog+',
    '=dog=',
    '/dog/',
    '<dog>',
    '>dog<',
    '\\dog\\',
    '|dog|',
    '`dog`',
    '~dog~'
  ];


  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterSortService);
    Comparator.filterSortService = service;

    sortOptions = new SortOptions('id', (valueA, valueB) => 0);
    filterOptions = new FilterOptions('id', (element) => true);

    secondarySortOptions = new SortOptions('id', (valueA, valueB) => 0);
    secondaryFilterOptions = new FilterOptions('id', (element) => true);

    arrForCompare[0].person.birthday = new Date(1902, 1, 22, 2, 30, 20, 190);
    arrForCompare[1].person.birthday = new Date(1902, 1, 1);
    arrForCompare[2].person.birthday = new Date(1902, 1, 22, 2, 13, 20, 180);
    arrForCompare[3].person.birthday = new Date(1903, 1, 22);
    arrForCompare[4].person.birthday = new Date(1901, 5, 2);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Sorting Suite', () => {

    describe('DATE sorting', () => {
      describe('no sort direction', () => {
        it('should not sort date', () => {
          sortOptions.variableIdentifier = 'person.birthday';
          sortOptions.comparator = SortComparator.DATE;
          sortOptions.sortDirection = SortDirection.NONE;
          sortOptions.initialSortDirection = SortDirection.NONE;
          sortOptions.directionOrder = [SortDirection.NONE];
          sortOptions.ignoreTimeOfDay = true;
          const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
          expect(sortOptions.variableMapper).toBeUndefined();
          expect(sortedItems[0].person.name).toBe('Mickey Mouse');
          expect(sortedItems[1].person.name).toBe('Goofy');
          expect(sortedItems[2].person.name).toBe('Minnie Mouse');
          expect(sortedItems[3].person.name).toBe('Bob Smith');
          expect(sortedItems[4].person.name).toBe('John Doe');
        });
      });
      describe('ascending', () => {
        it('should sort date ascending, ignoring time of day', () => {
          sortOptions.variableIdentifier = 'person.birthday';
          sortOptions.comparator = SortComparator.DATE;
          sortOptions.sortDirection = SortDirection.ASCENDING;
          sortOptions.ignoreTimeOfDay = true;
          const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
          expect(sortOptions.variableMapper).toBeUndefined();
          expect(sortedItems[0].person.name).toBe('John Doe');
          expect(sortedItems[1].person.name).toBe('Goofy');
          expect(sortedItems[2].person.name).toBe('Mickey Mouse');
          expect(sortedItems[3].person.name).toBe('Minnie Mouse');
          expect(sortedItems[4].person.name).toBe('Bob Smith');
        });
        it('should sort date ascending, not ignoring time of day', () => {
          sortOptions.variableIdentifier = 'person.birthday';
          sortOptions.comparator = SortComparator.DATE;
          sortOptions.sortDirection = SortDirection.ASCENDING;
          sortOptions.ignoreTimeOfDay = false;
          const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
          expect(sortOptions.variableMapper).toBeUndefined();
          expect(Comparator.getCurrentSortOptions()!.ignoreTimeOfDay).toBe(false);
          expect(sortedItems[0].person.name).toBe('John Doe');
          expect(sortedItems[1].person.name).toBe('Goofy');
          expect(sortedItems[2].person.name).toBe('Minnie Mouse');
          expect(sortedItems[3].person.name).toBe('Mickey Mouse');
          expect(sortedItems[4].person.name).toBe('Bob Smith');
        });
        it('should sort date ascending, mapping date variable to just the year', () => {
          sortOptions.variableIdentifier = 'person.birthday';
          sortOptions.comparator = SortComparator.DATE;
          sortOptions.sortDirection = SortDirection.ASCENDING;
          sortOptions.ignoreTimeOfDay = true;
          sortOptions.variableMapper = (date: Date) => {
            return date.getFullYear();
          };
          const mapperSpy = spyOn(sortOptions, 'variableMapper' as any).and.callThrough();
          const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
          expect(sortedItems[0].person.name).toBe('John Doe');
          expect(sortedItems[1].person.name).toBe('Mickey Mouse');
          expect(sortedItems[2].person.name).toBe('Goofy');
          expect(sortedItems[3].person.name).toBe('Minnie Mouse');
          expect(sortedItems[4].person.name).toBe('Bob Smith');
          expect(mapperSpy).toHaveBeenCalled();
        });
      });
      describe('ascending', () => {
        it('should sort date descending, ignoring time of day', () => {
          sortOptions.variableIdentifier = 'person.birthday';
          sortOptions.comparator = SortComparator.DATE;
          sortOptions.sortDirection = SortDirection.DESCENDING;
          sortOptions.ignoreTimeOfDay = true;
          const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
          expect(sortOptions.variableMapper).toBeUndefined();
          expect(sortedItems[0].person.name).toBe('Bob Smith');
          expect(sortedItems[1].person.name).toBe('Mickey Mouse');
          expect(sortedItems[2].person.name).toBe('Minnie Mouse');
          expect(sortedItems[3].person.name).toBe('Goofy');
          expect(sortedItems[4].person.name).toBe('John Doe');
        });
        it('should sort date descending, not ignoring time of day', () => {
          sortOptions.variableIdentifier = 'person.birthday';
          sortOptions.comparator = SortComparator.DATE;
          sortOptions.sortDirection = SortDirection.DESCENDING;
          sortOptions.ignoreTimeOfDay = false;
          const arrForCompareCopy = arrForCompare.concat();
          const bday0 = new Date(arrForCompareCopy[0].person.birthday);
          const bday2 = new Date(arrForCompareCopy[2].person.birthday);
          arrForCompareCopy[0].person.birthday = bday2;
          arrForCompareCopy[2].person.birthday = bday0;
          const sortedItems = service.filterAndSortItems(arrForCompareCopy, null, sortOptions);
          expect(sortOptions.variableMapper).toBeUndefined();
          expect(Comparator.getCurrentSortOptions()!.ignoreTimeOfDay).toBe(false);
          expect(sortedItems[0].person.name).toBe('Bob Smith');
          expect(sortedItems[1].person.name).toBe('Minnie Mouse');
          expect(sortedItems[2].person.name).toBe('Mickey Mouse');
          expect(sortedItems[3].person.name).toBe('Goofy');
          expect(sortedItems[4].person.name).toBe('John Doe');
        });
        it('should sort date descending, mapping date variable to just the year', () => {
          sortOptions.variableIdentifier = 'person.birthday';
          sortOptions.comparator = SortComparator.DATE;
          sortOptions.sortDirection = SortDirection.DESCENDING;
          sortOptions.ignoreTimeOfDay = true;
          sortOptions.variableMapper = (date: Date) => {
            return date.getFullYear();
          };
          const mapperSpy = spyOn(sortOptions, 'variableMapper' as any).and.callThrough();
          const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
          expect(sortedItems[0].person.name).toBe('Bob Smith');
          expect(sortedItems[1].person.name).toBe('Mickey Mouse');
          expect(sortedItems[2].person.name).toBe('Goofy');
          expect(sortedItems[3].person.name).toBe('Minnie Mouse');
          expect(sortedItems[4].person.name).toBe('John Doe');
          expect(mapperSpy).toHaveBeenCalled();
        });
      });
    });

    describe('NUMERIC sorting', () => {
      describe('no sort direction', () => {
        it('should not sort on number', () => {
          sortOptions.variableIdentifier = 'person.age';
          sortOptions.comparator = SortComparator.NUMERIC;
          sortOptions.sortDirection = SortDirection.NONE;
          sortOptions.initialSortDirection = SortDirection.NONE;
          sortOptions.directionOrder = [SortDirection.NONE];
          sortOptions.ignoreTimeOfDay = true;
          const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
          expect(sortOptions.variableMapper).toBeUndefined();
          expect(sortedItems[0].person.name).toBe('Mickey Mouse');
          expect(sortedItems[1].person.name).toBe('Goofy');
          expect(sortedItems[2].person.name).toBe('Minnie Mouse');
          expect(sortedItems[3].person.name).toBe('Bob Smith');
          expect(sortedItems[4].person.name).toBe('John Doe');
        });
      });

      describe('ascending', () => {
        it('should sort age ascending', () => {
          sortOptions.variableIdentifier = 'person.age';
          sortOptions.comparator = SortComparator.NUMERIC;
          sortOptions.sortDirection = SortDirection.ASCENDING;
          const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
          expect(sortOptions.variableMapper).toBeUndefined();
          expect(sortedItems[0].person.name).toBe('Bob Smith');
          expect(sortedItems[1].person.name).toBe('John Doe');
          expect(sortedItems[2].person.name).toBe('Mickey Mouse');
          expect(sortedItems[3].person.name).toBe('Goofy');
          expect(sortedItems[4].person.name).toBe('Minnie Mouse');
        });
        describe('unset identifiers', () => {
          it('should sort ascending, using mapper function, empty string identifier', () => {
            sortOptions.variableIdentifier = '';
            sortOptions.comparator = SortComparator.NUMERIC;
            sortOptions.sortDirection = SortDirection.ASCENDING;
            sortOptions.variableMapper = (item) => item.person.age + item.id;
            const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
            expect(sortedItems[0].person.name).toBe('Bob Smith');
            expect(sortedItems[1].person.name).toBe('John Doe');
            expect(sortedItems[2].person.name).toBe('Goofy');
            expect(sortedItems[3].person.name).toBe('Mickey Mouse');
            expect(sortedItems[4].person.name).toBe('Minnie Mouse');
          });
          it('should sort ascending, using mapper function, null identifier', () => {
            sortOptions.variableIdentifier = null;
            sortOptions.comparator = SortComparator.NUMERIC;
            sortOptions.sortDirection = SortDirection.ASCENDING;
            sortOptions.variableMapper = (item) => item.person.age + item.id;
            const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
            expect(sortedItems[0].person.name).toBe('Bob Smith');
            expect(sortedItems[1].person.name).toBe('John Doe');
            expect(sortedItems[2].person.name).toBe('Goofy');
            expect(sortedItems[3].person.name).toBe('Mickey Mouse');
            expect(sortedItems[4].person.name).toBe('Minnie Mouse');
          });
          it('should sort ascending, using mapper function, undefined identifier', () => {
            sortOptions.variableIdentifier = undefined;
            sortOptions.comparator = SortComparator.NUMERIC;
            sortOptions.sortDirection = SortDirection.ASCENDING;
            sortOptions.variableMapper = (item) => item.person.age + item.id;
            const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
            expect(sortedItems[0].person.name).toBe('Bob Smith');
            expect(sortedItems[1].person.name).toBe('John Doe');
            expect(sortedItems[2].person.name).toBe('Goofy');
            expect(sortedItems[3].person.name).toBe('Mickey Mouse');
            expect(sortedItems[4].person.name).toBe('Minnie Mouse');
          });
        });
      });
      describe('descending', () => {
        it('should sort age descending', () => {
          sortOptions.variableIdentifier = 'person.age';
          sortOptions.comparator = SortComparator.NUMERIC;
          sortOptions.sortDirection = SortDirection.DESCENDING;
          const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
          expect(sortOptions.variableMapper).toBeUndefined();
          expect(sortedItems[0].person.name).toBe('Mickey Mouse');
          expect(sortedItems[1].person.name).toBe('Goofy');
          expect(sortedItems[2].person.name).toBe('Minnie Mouse');
          expect(sortedItems[3].person.name).toBe('John Doe');
          expect(sortedItems[4].person.name).toBe('Bob Smith');
        });
        it('should sort age descending, mapping variable', () => {
          sortOptions.variableIdentifier = 'person.age';
          sortOptions.comparator = SortComparator.NUMERIC;
          sortOptions.sortDirection = SortDirection.DESCENDING;
          sortOptions.variableMapper = (age: number) => {
            return age > 65 ? 0 : age;
          };
          const mapperSpy = spyOn(sortOptions, 'variableMapper' as any).and.callThrough();
          const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
          expect(sortedItems[0].person.name).toBe('John Doe');
          expect(sortedItems[1].person.name).toBe('Bob Smith');
          expect(sortedItems[2].person.name).toBe('Mickey Mouse');
          expect(sortedItems[3].person.name).toBe('Goofy');
          expect(sortedItems[4].person.name).toBe('Minnie Mouse');
          expect(mapperSpy).toHaveBeenCalled();
        });
      });
    });

    describe('BOOLEAN sorting', () => {
      describe('no sort direction', () => {
        it('should not sort on boolean', () => {
          sortOptions.variableIdentifier = 'person.isMale';
          sortOptions.comparator = SortComparator.BOOLEAN;
          sortOptions.sortDirection = SortDirection.NONE;
          sortOptions.initialSortDirection = SortDirection.NONE;
          sortOptions.directionOrder = [SortDirection.NONE];
          const arrForCompareCopy = arrForCompare.concat();
          const spy = spyOn(arrForCompareCopy, 'sort').and.callThrough();
          const sortedItems = service.filterAndSortItems(arrForCompareCopy, null, sortOptions);
          expect(sortOptions.variableMapper).toBeUndefined();
          expect(spy).not.toHaveBeenCalled();
          expect(sortedItems[0].person.name).toBe('Mickey Mouse');
          expect(sortedItems[1].person.name).toBe('Goofy');
          expect(sortedItems[2].person.name).toBe('Minnie Mouse');
          expect(sortedItems[3].person.name).toBe('Bob Smith');
          expect(sortedItems[4].person.name).toBe('John Doe');
        });
      });
      it('should sort isMale ascending', () => {
        sortOptions.variableIdentifier = 'person.isMale';
        sortOptions.comparator = SortComparator.BOOLEAN;
        sortOptions.sortDirection = SortDirection.ASCENDING;
        const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
        expect(sortOptions.variableMapper).toBeUndefined();
        expect(sortedItems[0].person.name).toBe('Minnie Mouse');
        expect(sortedItems[1].person.name).toBe('Mickey Mouse');
        expect(sortedItems[2].person.name).toBe('Goofy');
        expect(sortedItems[3].person.name).toBe('Bob Smith');
        expect(sortedItems[4].person.name).toBe('John Doe');
      });
      it('should sort male ascending, mapping variable', () => {
        sortOptions.variableIdentifier = null;
        sortOptions.comparator = SortComparator.BOOLEAN;
        sortOptions.sortDirection = SortDirection.ASCENDING;
        sortOptions.variableMapper = (item: any) => {
          return item.person.isMale;
        };
        const mapperSpy = spyOn(sortOptions, 'variableMapper' as any).and.callThrough();
        const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
        expect(sortedItems[0].person.name).toBe('Minnie Mouse');
        expect(sortedItems[1].person.name).toBe('Mickey Mouse');
        expect(sortedItems[2].person.name).toBe('Goofy');
        expect(sortedItems[3].person.name).toBe('Bob Smith');
        expect(sortedItems[4].person.name).toBe('John Doe');
        expect(mapperSpy).toHaveBeenCalled();
      });
      it('should sort isMale descending', () => {
        sortOptions.variableIdentifier = 'person.isMale';
        sortOptions.comparator = SortComparator.BOOLEAN;
        sortOptions.sortDirection = SortDirection.DESCENDING;
        const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
        expect(sortOptions.variableMapper).toBeUndefined();
        expect(sortedItems[0].person.name).toBe('Mickey Mouse');
        expect(sortedItems[1].person.name).toBe('Goofy');
        expect(sortedItems[2].person.name).toBe('Bob Smith');
        expect(sortedItems[3].person.name).toBe('John Doe');
        expect(sortedItems[4].person.name).toBe('Minnie Mouse');
      });
    });

    describe('TRUTHY sorting', () => {
      describe('no sort direction', () => {
        it('should not sort on truthy', () => {
          sortOptions.variableIdentifier = 'person.data';
          sortOptions.comparator = SortComparator.TRUTHY;
          sortOptions.initialSortDirection = SortDirection.NONE;
          const arrForCompareCopy = arrForCompare.concat();
          const spy = spyOn(arrForCompareCopy, 'sort');
          const sortedItems = service.filterAndSortItems(arrForCompareCopy, null, sortOptions);
          expect(sortOptions.variableMapper).toBeUndefined();
          expect(spy).not.toHaveBeenCalled();
        });
      });
      it('should sort ascending', () => {
        sortOptions.variableIdentifier = null;
        sortOptions.comparator = SortComparator.TRUTHY;
        sortOptions.sortDirection = SortDirection.ASCENDING;
        const sortedItems = service.filterAndSortItems(truthyAndFalsyArrForCompare.concat(), null, sortOptions);
        expect(sortOptions.variableMapper).toBeUndefined();
        expect(sortedItems[0]).toBe(false);
        expect(sortedItems[1]).toBe(0);
        expect(sortedItems[2]).toBe(-0);
        expect(sortedItems[3]).toBe("");
        expect(sortedItems[4]).toBe('');
        expect(sortedItems[5]).toBe(``);
        expect(sortedItems[6]).toBe(null);
        expect(sortedItems[7]).toBeNaN();
        expect(sortedItems[8]).toBe(document.all);
        expect(sortedItems[9]).toBe('5');
        expect(sortedItems[10]).toEqual([]);
        // undefined always sorts last
        expect(sortedItems[11]).toBe(undefined);
      });
      it('should sort ascending, mapping variable', () => {
        sortOptions.variableIdentifier = null;
        sortOptions.comparator = SortComparator.TRUTHY;
        sortOptions.sortDirection = SortDirection.ASCENDING;
        sortOptions.variableMapper = (item: any) => {
          return item !== '' ? item : 'make a truthy string';
        };
        const mapperSpy = spyOn(sortOptions, 'variableMapper' as any).and.callThrough();
        const sortedItems = service.filterAndSortItems(truthyAndFalsyArrForCompare.concat(), null, sortOptions);
        expect(sortedItems[0]).toBe(false);
        expect(sortedItems[1]).toBe(0);
        expect(sortedItems[2]).toBe(-0);
        expect(sortedItems[3]).toBe(null);
        expect(sortedItems[4]).toBeNaN();
        expect(sortedItems[5]).toBe(document.all);
        expect(sortedItems[6]).toBe("");
        expect(sortedItems[7]).toBe('5');
        expect(sortedItems[8]).toBe('');
        expect(sortedItems[9]).toBe(``);
        expect(sortedItems[10]).toEqual([]);
        // undefined always sorts last
        expect(sortedItems[11]).toBe(undefined);
        expect(mapperSpy).toHaveBeenCalled();
      });
      it('should sort descending', () => {
        sortOptions.variableIdentifier = null;
        sortOptions.comparator = SortComparator.TRUTHY;
        sortOptions.sortDirection = SortDirection.DESCENDING;
        const sortedItems = service.filterAndSortItems(truthyAndFalsyArrForCompare.concat(), null, sortOptions);
        expect(sortOptions.variableMapper).toBeUndefined();
        expect(sortedItems[0]).toBe('5');
        expect(sortedItems[1]).toEqual([]);
        expect(sortedItems[2]).toBe(false);
        expect(sortedItems[3]).toBe(0);
        expect(sortedItems[4]).toBe(-0);
        expect(sortedItems[5]).toBe("");
        expect(sortedItems[6]).toBe('');
        expect(sortedItems[7]).toBe(``);
        expect(sortedItems[8]).toBe(null);
        expect(sortedItems[9]).toBeNaN();
        expect(sortedItems[10]).toBe(document.all);
        // undefined always sorts last
        expect(sortedItems[11]).toBe(undefined);
      });
    });
    describe('ALPHABETICAL sorting', () => {
      describe('no sort direction', () => {
        it('should not sort', () => {
          sortOptions.variableIdentifier = 'person.nickname';
          sortOptions.comparator = SortComparator.ALPHABETICAL;
          sortOptions.initialSortDirection = SortDirection.NONE;
          const arrForCompareCopy = arrForCompare.concat();
          const spy = spyOn(arrForCompareCopy, 'sort');
          const sortedItems = service.filterAndSortItems(arrForCompareCopy, null, sortOptions);
          expect(sortOptions.variableMapper).toBeUndefined();
          expect(spy).not.toHaveBeenCalled();
        });
      });
      describe('ascending', () => {
        describe('no localcompare', () => {
          it('should sort ascending without special characters', () => {
            sortOptions.variableIdentifier = 'person.nickname';
            sortOptions.comparator = SortComparator.ALPHABETICAL;
            sortOptions.sortDirection = SortDirection.ASCENDING;
            const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
            expect(sortedItems[0].person.nickname).toBe('Bobby');
            expect(sortedItems[1].person.nickname).toBe('Goof');
            expect(sortedItems[2].person.nickname).toBe('Mick');
            expect(sortedItems[3].person.nickname).toBe('Mr. Joey');
            expect(sortedItems[4].person.nickname).toBe('Míní');
          });
          it('should sort descending without special characters', () => {
            sortOptions.variableIdentifier = 'person.nickname';
            sortOptions.comparator = SortComparator.ALPHABETICAL;
            sortOptions.sortDirection = SortDirection.DESCENDING;
            const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
            expect(sortedItems[0].person.nickname).toBe('Míní');
            expect(sortedItems[1].person.nickname).toBe('Mr. Joey');
            expect(sortedItems[2].person.nickname).toBe('Mick');
            expect(sortedItems[3].person.nickname).toBe('Goof');
            expect(sortedItems[4].person.nickname).toBe('Bobby');
          });
        });
        describe('using localcompare', () => {
          it('should sort ascending with special characters', () => {
            sortOptions.variableIdentifier = 'person.nickname';
            sortOptions.comparator = SortComparator.ALPHABETICAL;
            sortOptions.sortDirection = SortDirection.ASCENDING;
            sortOptions.useLocaleCompare = true;
            const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
            expect(sortedItems[0].person.nickname).toBe('Bobby');
            expect(sortedItems[1].person.nickname).toBe('Goof');
            expect(sortedItems[2].person.nickname).toBe('Mick');
            expect(sortedItems[3].person.nickname).toBe('Míní');
            expect(sortedItems[4].person.nickname).toBe('Mr. Joey');
          });
          it('should sort descending with special characters', () => {
            sortOptions.variableIdentifier = 'person.nickname';
            sortOptions.comparator = SortComparator.ALPHABETICAL;
            sortOptions.sortDirection = SortDirection.DESCENDING;
            sortOptions.useLocaleCompare = true;
            const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
            expect(sortedItems[0].person.nickname).toBe('Mr. Joey');
            expect(sortedItems[1].person.nickname).toBe('Míní');
            expect(sortedItems[2].person.nickname).toBe('Mick');
            expect(sortedItems[3].person.nickname).toBe('Goof');
            expect(sortedItems[4].person.nickname).toBe('Bobby');
          });
          it('should sort ascending with special characters, with both localeCompareOptions set', () => {
            sortOptions.variableIdentifier = 'person.nickname';
            sortOptions.comparator = SortComparator.ALPHABETICAL;
            sortOptions.sortDirection = SortDirection.ASCENDING;
            sortOptions.localeCompareOptions = ['en', { sensitivity: 'base' }];
            sortOptions.useLocaleCompare = true;
            const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
            expect(sortedItems[0].person.nickname).toBe('Bobby');
            expect(sortedItems[1].person.nickname).toBe('Goof');
            expect(sortedItems[2].person.nickname).toBe('Mick');
            expect(sortedItems[3].person.nickname).toBe('Míní');
            expect(sortedItems[4].person.nickname).toBe('Mr. Joey');
          });
          it('should sort ascending with special characters, with only the first localeCompareOptions set', () => {
            sortOptions.variableIdentifier = 'person.nickname';
            sortOptions.comparator = SortComparator.ALPHABETICAL;
            sortOptions.sortDirection = SortDirection.ASCENDING;
            sortOptions.localeCompareOptions = ['en'];
            sortOptions.useLocaleCompare = true;
            const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
            expect(sortedItems[0].person.nickname).toBe('Bobby');
            expect(sortedItems[1].person.nickname).toBe('Goof');
            expect(sortedItems[2].person.nickname).toBe('Mick');
            expect(sortedItems[3].person.nickname).toBe('Míní');
            expect(sortedItems[4].person.nickname).toBe('Mr. Joey');
          });
        });
        describe('don\'t ignore case', () => {
          it('should sort ascending', () => {
            sortOptions.variableIdentifier = null;
            sortOptions.comparator = SortComparator.ALPHABETICAL;
            sortOptions.sortDirection = SortDirection.ASCENDING;
            sortOptions.ignoreCase = false;
            sortOptions.useLocaleCompare = false;
            const sortedItems = service.filterAndSortItems(stringArrForCompare.concat(), null, sortOptions);
            expect(sortedItems[0]).toBe('024');
            expect(sortedItems[1]).toBe(12);
            expect(sortedItems[2]).toBe('12');
            expect(sortedItems[3]).toBe(24);
            expect(sortedItems[4]).toBe('Amos');
            expect(sortedItems[5]).toBe('Donna');
            expect(sortedItems[6]).toBe('adam');
            expect(sortedItems[7]).toBe('daine');
            expect(sortedItems[8]).toBe('àbraham');
          });
        });
        describe('sort numbers as strings', () => {
          it('should sort ascending', () => {
            sortOptions.variableIdentifier = null;
            sortOptions.comparator = SortComparator.ALPHABETICAL;
            sortOptions.sortDirection = SortDirection.ASCENDING;
            sortOptions.useLocaleCompare = true;
            const sortedItems = service.filterAndSortItems(stringArrForCompare.concat(), null, sortOptions);
            expect(sortedItems[0]).toBe('024');
            expect(sortedItems[1]).toBe(12);
            expect(sortedItems[2]).toBe('12');
            expect(sortedItems[3]).toBe(24);
            expect(sortedItems[4]).toBe('àbraham');
            expect(sortedItems[5]).toBe('adam');
            expect(sortedItems[6]).toBe('Amos');
            expect(sortedItems[7]).toBe('daine');
            expect(sortedItems[8]).toBe('Donna');
          });
        });
        describe('sort with mapper', () => {
          it('should sort ascending', () => {
            sortOptions.variableIdentifier = null;
            sortOptions.comparator = SortComparator.ALPHABETICAL;
            sortOptions.sortDirection = SortDirection.ASCENDING;
            sortOptions.ignoreCase = true;
            sortOptions.useLocaleCompare = true;
            sortOptions.variableMapper = (val: any) => {
              return Comparator.isString(val) ? val : 'Number ' + val.toString();
            };
            const mapperSpy = spyOn(sortOptions, 'variableMapper' as any).and.callThrough();
            const sortedItems = service.filterAndSortItems(stringArrForCompare.concat(), null, sortOptions);
            expect(mapperSpy).toHaveBeenCalled();
            expect(sortedItems[0]).toBe('024');
            expect(sortedItems[1]).toBe('12');
            expect(sortedItems[2]).toBe('àbraham');
            expect(sortedItems[3]).toBe('adam');
            expect(sortedItems[4]).toBe('Amos');
            expect(sortedItems[5]).toBe('daine');
            expect(sortedItems[6]).toBe('Donna');
            expect(sortedItems[7]).toBe(12);
            expect(sortedItems[8]).toBe(24);
          });
        });
      });
    });

    it('should multisort by sortOrder', () => {

      sortOptions.variableIdentifier = 'person.birthday';
      sortOptions.comparator = SortComparator.DATE;
      sortOptions.sortDirection = SortDirection.ASCENDING;
      sortOptions.ignoreTimeOfDay = true;
      sortOptions.sortOrder = 0;

      secondarySortOptions.variableIdentifier = 'person.isMale';
      secondarySortOptions.comparator = SortComparator.BOOLEAN;
      secondarySortOptions.sortDirection = SortDirection.ASCENDING;
      secondarySortOptions.sortOrder = 1;

      const arrForCompareCopy = arrForCompare.concat();
      const sortedItems = service.filterAndSortItems(arrForCompareCopy, null, [secondarySortOptions, sortOptions]);

      expect(sortOptions.variableMapper).toBeUndefined();
      expect(sortedItems[0].person.name).toBe('Minnie Mouse');
      expect(sortedItems[1].person.name).toBe('John Doe');
      expect(sortedItems[2].person.name).toBe('Goofy');
      expect(sortedItems[3].person.name).toBe('Mickey Mouse');
      expect(sortedItems[4].person.name).toBe('Bob Smith');
    });

  });
  
  describe('Filtering Suite', () => {
    describe('CONTAINS_STRING filtering', () => {
      it('should find string', () => {
        filterOptions.comparator = FilterComparator.CONTAINS_STRING;
        filterOptions.filterValue = 'dog';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'title';

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(3);

      });
      it('should not find string', () => {
        filterOptions.comparator = FilterComparator.CONTAINS_STRING;
        filterOptions.filterValue = 'dog';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'title';
        filterOptions.ignoreCase = false;

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(0);
      });
      it('should find all descriptions when converting descriptions using the variableMappers', () => {
        filterOptions.comparator = FilterComparator.CONTAINS_STRING;
        filterOptions.filterValue = 'oze ';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'description';
        filterOptions.variableMappers = (description: string) => 'That ooze smells funny.';

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems).toEqual(stories);
      });
      describe('Match.ALL', () => {
        it('should find string with MatchType.ALL', () => {
          filterOptions.comparator = FilterComparator.CONTAINS_STRING;
          filterOptions.filterValue = 'dog';
          filterOptions.matchType = MatchType.ALL;
          filterOptions.variableIdentifiers = ['title', 'description'];

          const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

          expect(filteredItems.length).toBe(3);

        });
        it('should find only one match with MatchType.ALL when case-sensitive', () => {
          filterOptions.comparator = FilterComparator.CONTAINS_STRING;
          filterOptions.filterValue = 'Dog';
          filterOptions.matchType = MatchType.ALL;
          filterOptions.variableIdentifiers = ['title', 'description'];
          filterOptions.ignoreCase = false;

          const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

          expect(filteredItems.length).toBe(1);
        });
      });

    });

    describe('CONTAINS_WORD filtering', () => {
      it('should find a word', () => {
        filterOptions.comparator = FilterComparator.CONTAINS_WORD;
        filterOptions.filterValue = 'dog';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'title';

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(3);

      });
      it('should not find a word with a space', () => {
        filterOptions.comparator = FilterComparator.CONTAINS_WORD;
        filterOptions.filterValue = 'dog ';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'title';

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(0);

      });
      it('should not find a word with if case-sensitive', () => {
        filterOptions.comparator = FilterComparator.CONTAINS_WORD;
        filterOptions.filterValue = 'dog';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'title';
        filterOptions.ignoreCase = false;

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(0);

      });
      it('should only find one match with MatchType.ALL', () => {
        filterOptions.comparator = FilterComparator.CONTAINS_WORD;
        filterOptions.filterValue = 'dog';
        filterOptions.matchType = MatchType.ALL;
        filterOptions.variableIdentifiers = ['title', 'author'];

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(1);
        expect(filteredItems[0].title).toBe('A Dog Eat Dog World');

      });
      it('should find all descriptions when converting descriptions using the variableMappers', () => {
        filterOptions.comparator = FilterComparator.CONTAINS_WORD;
        filterOptions.filterValue = 'ooze';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'description';
        filterOptions.variableMappers = (description: string) => 'That ooze smells funny.';

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems).toEqual(stories);
      });
      describe('special characters - ', () => {
        describe('word starts or ends with', () => {
          it(', : ; ] } ) \' " ... .... … ? ! . - — @ # $ % ^ & * = / > < \\ | ` ~ should still find word', () => {
            filterOptions.comparator = FilterComparator.CONTAINS_WORD;
            filterOptions.filterValue = 'dog';
            filterOptions.matchType = MatchType.ANY;
            filterOptions.variableIdentifiers = null;

            const filteredItems = service.filterAndSortItems(wordsWithPunctuation.concat(), filterOptions, null);

            expect(filteredItems).toEqual(wordsWithPunctuation);
          });
        });
      });
    });

    describe('STARTS_WITH filtering', () => {
      it('should find string', () => {
        filterOptions.comparator = FilterComparator.STARTS_WITH;
        filterOptions.filterValue = 'The dog';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'title';

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(1);

      });
      it('should not find string when case sensitive', () => {
        filterOptions.comparator = FilterComparator.STARTS_WITH;
        filterOptions.filterValue = 'the dog';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'title';
        filterOptions.ignoreCase = false;

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(0);

      });
      it('should not find string when the string does not start with value', () => {
        filterOptions.comparator = FilterComparator.STARTS_WITH;
        filterOptions.filterValue = 'he dog';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'title';

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(0);

      });
      it('should find no matches with MatchType.ALL when one starts with a new line', () => {
        filterOptions.comparator = FilterComparator.STARTS_WITH;
        filterOptions.filterValue = 'A Hot';
        filterOptions.matchType = MatchType.ALL;
        filterOptions.variableIdentifiers = ['title', 'description'];

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(0);

      });
      it('should find only one match with MatchType.ALL', () => {
        filterOptions.comparator = FilterComparator.STARTS_WITH;
        filterOptions.filterValue = 'Snoopy';
        filterOptions.matchType = MatchType.ALL;
        filterOptions.variableIdentifiers = ['author', 'description'];

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(1);

      });
      it('should find no matches with MatchType.ALL when case sensitive', () => {
        filterOptions.comparator = FilterComparator.STARTS_WITH;
        filterOptions.filterValue = 'Snoopy';
        filterOptions.matchType = MatchType.ALL;
        filterOptions.variableIdentifiers = ['author', 'description'];
        filterOptions.ignoreCase = false;

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(0);

      });
      it('should find all descriptions when converting descriptions using the variableMappers', () => {
        filterOptions.comparator = FilterComparator.STARTS_WITH;
        filterOptions.filterValue = 'zoo';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'description';
        filterOptions.variableMappers = (description: string) => 'Zoos are fun.';

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems).toEqual(stories);
      });
    });

    describe('ENDS_WITH filtering', () => {
      it('should find string', () => {
        filterOptions.comparator = FilterComparator.ENDS_WITH;
        filterOptions.filterValue = 'eat.';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'description';

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(1);

      });
      it('should not find string when case sensitive', () => {
        filterOptions.comparator = FilterComparator.ENDS_WITH;
        filterOptions.filterValue = 'Eat.';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'description';
        filterOptions.ignoreCase = false;

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(0);

      });
      it('should not find string when the string does not end with value', () => {
        filterOptions.comparator = FilterComparator.ENDS_WITH;
        filterOptions.filterValue = 'eat';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'description';

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(0);

      });
      it('should find no matches when ending with a new line (\\n)', () => {
        filterOptions.comparator = FilterComparator.ENDS_WITH;
        filterOptions.filterValue = 'belong';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'description';

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(0);

      });
      it('should find no matches with MatchType.ALL', () => {
        filterOptions.comparator = FilterComparator.ENDS_WITH;
        filterOptions.filterValue = 'eat.';
        filterOptions.matchType = MatchType.ALL;
        filterOptions.variableIdentifiers = ['author', 'description'];

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(0);

      });
      it('should find all descriptions when converting descriptions using the variableMappers', () => {
        filterOptions.comparator = FilterComparator.ENDS_WITH;
        filterOptions.filterValue = 'oze';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'description';
        filterOptions.variableMappers = (description: string) => 'That ooze';

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems).toEqual(stories);
      });
    });

    describe('WORD_STARTS_WITH filtering', () => {
      it('should find word', () => {
        filterOptions.comparator = FilterComparator.WORD_STARTS_WITH;
        filterOptions.filterValue = 'dog';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'description';

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(3);

      });
      it('should find word ending in punctuation', () => {
        filterOptions.comparator = FilterComparator.WORD_STARTS_WITH;
        filterOptions.filterValue = 'ea';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'description';

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(1);

      });
      it('should not find string when case sensitive', () => {
        filterOptions.comparator = FilterComparator.WORD_STARTS_WITH;
        filterOptions.filterValue = 'Ea';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'description';
        filterOptions.ignoreCase = false;

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(0);

      });
      it('should not find string when the string does not start with value', () => {
        filterOptions.comparator = FilterComparator.WORD_STARTS_WITH;
        filterOptions.filterValue = 'zzoo';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'description';

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(0);

      });
      it('should find one match with MatchType.ALL when one starts with a new line', () => {
        filterOptions.comparator = FilterComparator.WORD_STARTS_WITH;
        filterOptions.filterValue = 'A';
        filterOptions.matchType = MatchType.ALL;
        filterOptions.variableIdentifiers = ['title', 'description'];

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(1);

      });
      it('should find only one match with MatchType.ALL', () => {
        filterOptions.comparator = FilterComparator.WORD_STARTS_WITH;
        filterOptions.filterValue = 'Snoop';
        filterOptions.matchType = MatchType.ALL;
        filterOptions.variableIdentifiers = ['author', 'description'];

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(1);

      });
      it('should find no matches with MatchType.ALL when case sensitive', () => {
        filterOptions.comparator = FilterComparator.WORD_STARTS_WITH;
        filterOptions.filterValue = 'Snoop';
        filterOptions.matchType = MatchType.ALL;
        filterOptions.variableIdentifiers = ['author', 'description'];
        filterOptions.ignoreCase = false;

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(0);

      });
      it('should find all descriptions when converting descriptions using the variableMappers', () => {
        filterOptions.comparator = FilterComparator.WORD_STARTS_WITH;
        filterOptions.filterValue = 'zoo';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'description';
        filterOptions.variableMappers = (description: string) => 'Go zoom fast!';

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems).toEqual(stories);
      });
      describe('special characters - ', () => {
        describe('word starts with', () => {
          it(', : ; ] } ) \' " ... .... … ? ! . - — @ # $ % ^ & * = / > < \\ | ` ~ should still find word', () => {
            filterOptions.comparator = FilterComparator.WORD_STARTS_WITH;
            filterOptions.filterValue = 'do';
            filterOptions.matchType = MatchType.ANY;
            filterOptions.variableIdentifiers = null;

            const filteredItems = service.filterAndSortItems(wordsWithPunctuation.concat(), filterOptions, null);

            expect(filteredItems).toEqual(wordsWithPunctuation);
          });
        });
      });
    });

    describe('WORD_ENDS_WITH filtering', () => {
      it('should find word', () => {
        filterOptions.comparator = FilterComparator.WORD_ENDS_WITH;
        filterOptions.filterValue = 'og';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'description';

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(2);

      });
      it('should find word ending in punctuation', () => {
        filterOptions.comparator = FilterComparator.WORD_ENDS_WITH;
        filterOptions.filterValue = 'at';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'description';

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(1);

      });
      it('should not find string when case sensitive', () => {
        filterOptions.comparator = FilterComparator.WORD_ENDS_WITH;
        filterOptions.filterValue = 'At';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'description';
        filterOptions.ignoreCase = false;

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(0);

      });
      it('should not find string when the string does not end with value', () => {
        filterOptions.comparator = FilterComparator.WORD_ENDS_WITH;
        filterOptions.filterValue = 'oozz';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'description';

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(0);

      });
      it('should find one match with MatchType.ALL when ending with punctuation', () => {
        filterOptions.comparator = FilterComparator.WORD_ENDS_WITH;
        filterOptions.filterValue = '?';
        filterOptions.matchType = MatchType.ALL;
        filterOptions.variableIdentifiers = ['author', 'description'];

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(1);

      });
      it('should find only one match with MatchType.ALL', () => {
        filterOptions.comparator = FilterComparator.WORD_ENDS_WITH;
        filterOptions.filterValue = 'noopy';
        filterOptions.matchType = MatchType.ALL;
        filterOptions.variableIdentifiers = ['author', 'description'];

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(1);

      });
      it('should find no matches with MatchType.ALL when case sensitive', () => {
        filterOptions.comparator = FilterComparator.WORD_ENDS_WITH;
        filterOptions.filterValue = 'Noopy';
        filterOptions.matchType = MatchType.ALL;
        filterOptions.variableIdentifiers = ['author', 'description'];
        filterOptions.ignoreCase = false;

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems.length).toBe(0);

      });
      it('should find all descriptions when converting descriptions using the variableMappers', () => {
        filterOptions.comparator = FilterComparator.WORD_ENDS_WITH;
        filterOptions.filterValue = 'oze';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableIdentifiers = 'description';
        filterOptions.variableMappers = (description: string) => 'That ooze is real.';

        const filteredItems = service.filterAndSortItems(stories.concat(), filterOptions, null);

        expect(filteredItems).toEqual(stories);
      });
      describe('special characters - ', () => {
        describe('word starts with', () => {
          it(', : ; ] } ) \' " ... .... … ? ! . - — @ # $ % ^ & * = / > < \\ | ` ~ should still find word', () => {
            filterOptions.comparator = FilterComparator.WORD_ENDS_WITH;
            filterOptions.filterValue = 'og';
            filterOptions.matchType = MatchType.ANY;
            filterOptions.variableIdentifiers = null;

            const filteredItems = service.filterAndSortItems(wordsWithPunctuation.concat(), filterOptions, null);

            expect(filteredItems).toEqual(wordsWithPunctuation);
          });
        });
      });
    });

    describe('EQUALS filtering', () => {
      it('should find everyone with an age of 92 even though we send "92"', () => {
        filterOptions.variableIdentifiers = 'person.age';
        filterOptions.comparator = FilterComparator.EQUALS;
        filterOptions.filterValue = '92';
        filterOptions.matchType = MatchType.ANY;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems[1].person.name).toBe('Goofy');
        expect(filteredItems[2].person.name).toBe('Minnie Mouse');
        expect(filteredItems.length).toBe(3);
      });
      it('should ignore case when filtering names', () => {
        filterOptions.variableIdentifiers = 'person.name';
        filterOptions.comparator = FilterComparator.EQUALS;
        filterOptions.filterValue = 'mickey mouse';
        filterOptions.matchType = MatchType.ANY;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems.length).toBe(1);
      });
      it('should not ignore case when filtering names', () => {
        filterOptions.variableIdentifiers = 'person.name';
        filterOptions.comparator = FilterComparator.EQUALS;
        filterOptions.filterValue = 'mickey mouse';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.ignoreCase = false;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems.length).toBe(0);
      });
      it('should find those with ages over 60', () => {
        filterOptions.variableIdentifiers = 'person.age';
        filterOptions.comparator = FilterComparator.EQUALS;
        filterOptions.filterValue = '60';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableMappers = (age: number) => age > 60 ? 60 : age;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).not.toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems[1].person.name).toBe('Goofy');
        expect(filteredItems[2].person.name).toBe('Minnie Mouse');
        expect(filteredItems[3].person.name).toBe('John Doe');
        expect(filteredItems.length).toBe(4);
      });
      it('should filter multiple with id <=1 on age with MatchType.ALL', () => {
        filterOptions.variableIdentifiers = ['person.age', null];
        filterOptions.comparator = FilterComparator.EQUALS;
        filterOptions.filterValue = '92';
        filterOptions.matchType = MatchType.ALL;
        filterOptions.variableMappers = [
          (age: number) => age,
          (item: any) => item.id <= 1 ? 92 : item.id
        ];
        const mapperSpy = spyOn(FilterComparator, 'getModifiedValue').and.callThrough();

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).not.toBeUndefined();
        expect(mapperSpy).toHaveBeenCalledTimes(2 * arrForCompare.length);
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems[1].person.name).toBe('Goofy');
        expect(filteredItems.length).toBe(2);
      });
    });

    describe('STRICT_EQUALS filtering', () => {
      it('should not find anyone with an age of 92 when we send "92"', () => {
        filterOptions.variableIdentifiers = 'person.age';
        filterOptions.comparator = FilterComparator.STRICT_EQUALS;
        filterOptions.filterValue = '92';
        filterOptions.matchType = MatchType.ANY;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems.length).toBe(0);
      });
      it('should ignore case when filtering names', () => {
        filterOptions.variableIdentifiers = 'person.name';
        filterOptions.comparator = FilterComparator.STRICT_EQUALS;
        filterOptions.filterValue = 'mickey mouse';
        filterOptions.matchType = MatchType.ANY;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems.length).toBe(1);
      });
      it('should not ignore case when filtering names', () => {
        filterOptions.variableIdentifiers = 'person.name';
        filterOptions.comparator = FilterComparator.STRICT_EQUALS;
        filterOptions.filterValue = 'mickey mouse';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.ignoreCase = false;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems.length).toBe(0);
      });
      it('should find those with ages over 60', () => {
        filterOptions.variableIdentifiers = 'person.age';
        filterOptions.comparator = FilterComparator.STRICT_EQUALS;
        filterOptions.filterValue = '60';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableMappers = (age: number) => age > 60 ? '60' : age.toString();

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).not.toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems[1].person.name).toBe('Goofy');
        expect(filteredItems[2].person.name).toBe('Minnie Mouse');
        expect(filteredItems[3].person.name).toBe('John Doe');
        expect(filteredItems.length).toBe(4);
      });
      it('should filter multiple with id <=1 on age with MatchType.ALL', () => {
        filterOptions.variableIdentifiers = ['person.age', null];
        filterOptions.comparator = FilterComparator.STRICT_EQUALS;
        filterOptions.filterValue = '92';
        filterOptions.matchType = MatchType.ALL;
        filterOptions.variableMappers = [
          (age: number) => age.toString(),
          (item: any) => item.id <= 1 ? '92' : item.id.toString()
        ];
        const mapperSpy = spyOn(FilterComparator, 'getModifiedValue').and.callThrough();

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).not.toBeUndefined();
        expect(mapperSpy).toHaveBeenCalledTimes(2 * arrForCompare.length);
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems[1].person.name).toBe('Goofy');
        expect(filteredItems.length).toBe(2);
      });
    });

    describe('LESS_THAN filtering', () => {
      it('should find everyone with an age less than 92 even though we send "92"', () => {
        filterOptions.variableIdentifiers = 'person.age';
        filterOptions.comparator = FilterComparator.LESS_THAN;
        filterOptions.filterValue = '92';
        filterOptions.matchType = MatchType.ANY;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Bob Smith');
        expect(filteredItems[1].person.name).toBe('John Doe');
        expect(filteredItems.length).toBe(2);
      });
      it('should find those with ages over 60, when we map those ages to 0', () => {
        filterOptions.variableIdentifiers = 'person.age';
        filterOptions.comparator = FilterComparator.LESS_THAN;
        filterOptions.filterValue = '1';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableMappers = (age: number) => age > 60 ? 0 : age;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).not.toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems[1].person.name).toBe('Goofy');
        expect(filteredItems[2].person.name).toBe('Minnie Mouse');
        expect(filteredItems[3].person.name).toBe('John Doe');
        expect(filteredItems.length).toBe(4);
      });
      it('should filter multiple with id <=1 on age with MatchType.ALL', () => {
        filterOptions.variableIdentifiers = ['person.age', null];
        filterOptions.comparator = FilterComparator.LESS_THAN;
        filterOptions.filterValue = '92';
        filterOptions.matchType = MatchType.ALL;
        filterOptions.variableMappers = [
          (age: number) => age,
          (item: any) => item.id < 4 ? 92 : item.id
        ];
        const mapperSpy = spyOn(FilterComparator, 'getModifiedValue').and.callThrough();

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).not.toBeUndefined();
        expect(mapperSpy).toHaveBeenCalledTimes(2 * arrForCompare.length);
        expect(filteredItems[0].person.name).toBe('John Doe');
        expect(filteredItems.length).toBe(1);
      });
    });

    describe('GREATER_THAN filtering', () => {
      it('should find everyone with an age less than 92 even though we send "92"', () => {
        filterOptions.variableIdentifiers = 'person.age';
        filterOptions.comparator = FilterComparator.GREATER_THAN;
        filterOptions.filterValue = '91';
        filterOptions.matchType = MatchType.ANY;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems[1].person.name).toBe('Goofy');
        expect(filteredItems[2].person.name).toBe('Minnie Mouse');
        expect(filteredItems.length).toBe(3);
      });
      it('should find those with ages over 64, when we map those ages 64 to 65', () => {
        filterOptions.variableIdentifiers = 'person.age';
        filterOptions.comparator = FilterComparator.GREATER_THAN;
        filterOptions.filterValue = '64';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableMappers = (age: number) => Number(age) >= 64 ? 65 : age;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).not.toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems[1].person.name).toBe('Goofy');
        expect(filteredItems[2].person.name).toBe('Minnie Mouse');
        expect(filteredItems[3].person.name).toBe('John Doe');
        expect(filteredItems.length).toBe(4);
      });
      it('should filter multiple with id <=1 on age with MatchType.ALL', () => {
        filterOptions.variableIdentifiers = ['person.age', null];
        filterOptions.comparator = FilterComparator.GREATER_THAN;
        filterOptions.filterValue = '65';
        filterOptions.matchType = MatchType.ALL;
        filterOptions.variableMappers = [
          (age: number) => age.toString(),
          (item: any) => item.id <= 1 ? '92' : item.id.toString()
        ];
        const mapperSpy = spyOn(FilterComparator, 'getModifiedValue').and.callThrough();

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).not.toBeUndefined();
        expect(mapperSpy).toHaveBeenCalledTimes(2 * arrForCompare.length);
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems[1].person.name).toBe('Goofy');
        expect(filteredItems.length).toBe(2);
      });
    });

    describe('LESS_THAN_OR_EQUAL filtering', () => {
      it('should find everyone with an age less than or equal 64 even though we send "64"', () => {
        filterOptions.variableIdentifiers = 'person.age';
        filterOptions.comparator = FilterComparator.LESS_THAN_OR_EQUAL;
        filterOptions.filterValue = '64';
        filterOptions.matchType = MatchType.ANY;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Bob Smith');
        expect(filteredItems[1].person.name).toBe('John Doe');
        expect(filteredItems.length).toBe(2);
      });
      it('should find those with ages over 60, when we map those ages to 1', () => {
        filterOptions.variableIdentifiers = 'person.age';
        filterOptions.comparator = FilterComparator.LESS_THAN_OR_EQUAL;
        filterOptions.filterValue = '1';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableMappers = (age: number) => age > 60 ? 1 : age;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).not.toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems[1].person.name).toBe('Goofy');
        expect(filteredItems[2].person.name).toBe('Minnie Mouse');
        expect(filteredItems[3].person.name).toBe('John Doe');
        expect(filteredItems.length).toBe(4);
      });
      it('should filter multiple with id <=1 on age with MatchType.ALL', () => {
        filterOptions.variableIdentifiers = ['person.age', null];
        filterOptions.comparator = FilterComparator.LESS_THAN_OR_EQUAL;
        filterOptions.filterValue = '64';
        filterOptions.matchType = MatchType.ALL;
        filterOptions.variableMappers = [
          (age: number) => age,
          (item: any) => item.id < 4 ? 65 : item.id
        ];
        const mapperSpy = spyOn(FilterComparator, 'getModifiedValue').and.callThrough();

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).not.toBeUndefined();
        expect(mapperSpy).toHaveBeenCalledTimes(2 * arrForCompare.length);
        expect(filteredItems[0].person.name).toBe('John Doe');
        expect(filteredItems.length).toBe(1);
      });
    });

    describe('GREATER_THAN_OR_EQUAL filtering', () => {
      it('should find everyone with an age greater than or equal to 64 even though we send "64"', () => {
        filterOptions.variableIdentifiers = 'person.age';
        filterOptions.comparator = FilterComparator.GREATER_THAN_OR_EQUAL;
        filterOptions.filterValue = '64';
        filterOptions.matchType = MatchType.ANY;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems[1].person.name).toBe('Goofy');
        expect(filteredItems[2].person.name).toBe('Minnie Mouse');
        expect(filteredItems[3].person.name).toBe('John Doe');
        expect(filteredItems.length).toBe(4);
      });
      it('should find those with ages at or over 65, when we map ages 64 to 65', () => {
        filterOptions.variableIdentifiers = 'person.age';
        filterOptions.comparator = FilterComparator.GREATER_THAN_OR_EQUAL;
        filterOptions.filterValue = '65';
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableMappers = (age: number) => Number(age) >= 64 ? 65 : age;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).not.toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems[1].person.name).toBe('Goofy');
        expect(filteredItems[2].person.name).toBe('Minnie Mouse');
        expect(filteredItems[3].person.name).toBe('John Doe');
        expect(filteredItems.length).toBe(4);
      });
      it('should filter multiple with id <=1 on age with MatchType.ALL', () => {
        filterOptions.variableIdentifiers = ['person.age', null];
        filterOptions.comparator = FilterComparator.GREATER_THAN_OR_EQUAL;
        filterOptions.filterValue = '64';
        filterOptions.matchType = MatchType.ALL;
        filterOptions.variableMappers = [
          (age: number) => age.toString(),
          (item: any) => item.id >= 3 ? '64' : item.id.toString()
        ];
        const mapperSpy = spyOn(FilterComparator, 'getModifiedValue').and.callThrough();

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).not.toBeUndefined();
        expect(mapperSpy).toHaveBeenCalledTimes(2 * arrForCompare.length);
        expect(filteredItems[0].person.name).toBe('John Doe');
        expect(filteredItems.length).toBe(1);
      });
    });

    describe('IS_AFTER_DATE filtering', () => {
      it('should only return dates after December 31, 1902', () => {
        filterOptions.variableIdentifiers = 'person.birthday';
        filterOptions.comparator = FilterComparator.IS_AFTER_DATE;
        filterOptions.filterValue = new Date('1902-12-31');
        filterOptions.matchType = MatchType.ANY;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Bob Smith');
        expect(filteredItems.length).toBe(1);
      });
      it('should only return dates after February 2, 1902, ignoring time of day', () => {
        filterOptions.variableIdentifiers = 'person.birthday';
        filterOptions.comparator = FilterComparator.IS_AFTER_DATE;
        filterOptions.filterValue = new Date(1902, 1, 22, 0, 0, 0, 0);
        filterOptions.matchType = MatchType.ANY;
        filterOptions.ignoreTimeOfDay = true;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Bob Smith');
        expect(filteredItems.length).toBe(1);
      });
      it('should only return dates after February 2, 1902, NOT ignoring time of day', () => {
        filterOptions.variableIdentifiers = 'person.birthday';
        filterOptions.comparator = FilterComparator.IS_AFTER_DATE;
        filterOptions.filterValue = new Date(1902, 1, 22, 0, 0, 0, 0);
        filterOptions.matchType = MatchType.ANY;
        filterOptions.ignoreTimeOfDay = false;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems[1].person.name).toBe('Minnie Mouse');
        expect(filteredItems[2].person.name).toBe('Bob Smith');
        expect(filteredItems.length).toBe(3);
      });
      it('should only return dates after February 2, 1902, with variableMapper, not ignoring time of day', () => {
        filterOptions.variableIdentifiers = 'person.birthday';
        filterOptions.comparator = FilterComparator.IS_AFTER_DATE;
        filterOptions.filterValue = new Date(1902, 1, 22, 0, 0, 0, 0);
        filterOptions.matchType = MatchType.ANY;
        filterOptions.ignoreTimeOfDay = false;
        filterOptions.variableMappers = (date: Date) => {
          date.setHours(0, 0, 0, 0);
          return date;
        }

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).not.toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Bob Smith');
        expect(filteredItems.length).toBe(1);
      });
    });

    describe('IS_BEFORE_DATE filtering', () => {
      it('should only return dates before December 31, 1902', () => {
        filterOptions.variableIdentifiers = 'person.birthday';
        filterOptions.comparator = FilterComparator.IS_BEFORE_DATE;
        filterOptions.filterValue = new Date(1902, 11, 31);
        filterOptions.matchType = MatchType.ANY;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems[1].person.name).toBe('Goofy');
        expect(filteredItems[2].person.name).toBe('Minnie Mouse');
        expect(filteredItems[3].person.name).toBe('John Doe');
        expect(filteredItems.length).toBe(4);
      });
      it('should only return dates before February 2, 1902, ignoring time of day', () => {
        filterOptions.variableIdentifiers = 'person.birthday';
        filterOptions.comparator = FilterComparator.IS_BEFORE_DATE;
        filterOptions.filterValue = new Date(1902, 1, 22, 23, 59, 59, 999);
        filterOptions.matchType = MatchType.ANY;
        filterOptions.ignoreTimeOfDay = true;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Goofy');
        expect(filteredItems[1].person.name).toBe('John Doe');
        expect(filteredItems.length).toBe(2);
      });
      it('should only return dates before February 2, 1902, NOT ignoring time of day', () => {
        filterOptions.variableIdentifiers = 'person.birthday';
        filterOptions.comparator = FilterComparator.IS_BEFORE_DATE;
        filterOptions.filterValue = new Date(1902, 1, 22, 23, 59, 59, 999);
        filterOptions.matchType = MatchType.ANY;
        filterOptions.ignoreTimeOfDay = false;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems[1].person.name).toBe('Goofy');
        expect(filteredItems[2].person.name).toBe('Minnie Mouse');
        expect(filteredItems[3].person.name).toBe('John Doe');
        expect(filteredItems.length).toBe(4);
      });
      it('should only return before after February 2, 1902, with variableMapper, not ignoring time of day', () => {
        filterOptions.variableIdentifiers = 'person.birthday';
        filterOptions.comparator = FilterComparator.IS_BEFORE_DATE;
        filterOptions.filterValue = new Date(1902, 1, 22, 1, 0, 0, 0);
        filterOptions.matchType = MatchType.ANY;
        filterOptions.ignoreTimeOfDay = false;
        filterOptions.variableMappers = (date: Date) => {
          date.setHours(0, 0, 0, 0);
          return date;
        }

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).not.toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems[1].person.name).toBe('Goofy');
        expect(filteredItems[2].person.name).toBe('Minnie Mouse');
        expect(filteredItems[3].person.name).toBe('John Doe');
        expect(filteredItems.length).toBe(4);
      });
    });

    describe('DATE_IS filtering', () => {
      it('should only return items with dates on February 2, 1902', () => {
        filterOptions.variableIdentifiers = 'person.birthday';
        filterOptions.comparator = FilterComparator.DATE_IS;
        filterOptions.filterValue = new Date(1902, 1, 22, 2, 30, 20, 190);
        filterOptions.matchType = MatchType.ANY;
        filterOptions.ignoreTimeOfDay = true;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems[1].person.name).toBe('Minnie Mouse');
        expect(filteredItems.length).toBe(2);
      });
      it('should only return items with dates on February 2, 1902, NOT ignoring time of day', () => {
        filterOptions.variableIdentifiers = 'person.birthday';
        filterOptions.comparator = FilterComparator.DATE_IS;
        filterOptions.filterValue = new Date(1902, 1, 22, 2, 30, 20, 190);
        filterOptions.matchType = MatchType.ANY;
        filterOptions.ignoreTimeOfDay = false;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems.length).toBe(1);
      });
      it('should only return items with dates on February 2, 1902 exactly matching when using variable mapper', () => {
        filterOptions.variableIdentifiers = 'person.birthday';
        filterOptions.comparator = FilterComparator.DATE_IS;
        filterOptions.filterValue = new Date(1902, 1, 22, 2, 30, 20, 190);
        filterOptions.matchType = MatchType.ANY;
        filterOptions.ignoreTimeOfDay = true;
        filterOptions.variableMappers = (date: Date) => {
          if (date.getTime() === filterOptions.filterValue.getTime()) {
            return date;
          } else {
            return new Date(1900, 0, 1, 0, 0, 0, 0);
          }
        }

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).not.toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems.length).toBe(1);
      });
    });

    describe('IS_ON_OR_AFTER_DATE filtering', () => {
      it('should only return dates after February 2, 1902', () => {
        filterOptions.variableIdentifiers = 'person.birthday';
        filterOptions.comparator = FilterComparator.IS_ON_OR_AFTER_DATE;
        filterOptions.filterValue = new Date(1902, 1, 22, 2, 30, 20, 190);
        filterOptions.matchType = MatchType.ANY;
        filterOptions.ignoreTimeOfDay = false;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems[1].person.name).toBe('Bob Smith');
        expect(filteredItems.length).toBe(2);
      });
      it('should only return dates after February 2, 1902, ignoring time of day', () => {
        filterOptions.variableIdentifiers = 'person.birthday';
        filterOptions.comparator = FilterComparator.IS_ON_OR_AFTER_DATE;
        filterOptions.filterValue = new Date(1902, 1, 22, 23, 59, 59, 999);
        filterOptions.matchType = MatchType.ANY;
        filterOptions.ignoreTimeOfDay = true;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems[1].person.name).toBe('Minnie Mouse');
        expect(filteredItems[2].person.name).toBe('Bob Smith');
        expect(filteredItems.length).toBe(3);
      });
      it('should only return dates after February 2, 1902, with variableMapper, not ignoring time of day', () => {
        filterOptions.variableIdentifiers = 'person.birthday';
        filterOptions.comparator = FilterComparator.IS_ON_OR_AFTER_DATE;
        filterOptions.filterValue = new Date(1902, 1, 22, 23, 59, 59, 999);
        filterOptions.matchType = MatchType.ANY;
        filterOptions.ignoreTimeOfDay = false;
        filterOptions.variableMappers = (date: Date) => {
          date.setHours(0, 0, 0, 0);
          return date;
        }

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).not.toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Bob Smith');
        expect(filteredItems.length).toBe(1);
      });
    });

    describe('IS_ON_OR_BEFORE_DATE filtering', () => {
      it('should only return dates on or before February 2, 1902, ignoring time of day', () => {
        filterOptions.variableIdentifiers = 'person.birthday';
        filterOptions.comparator = FilterComparator.IS_ON_OR_BEFORE_DATE;
        filterOptions.filterValue = new Date(1902, 1, 22, 0, 0, 0, 0);
        filterOptions.matchType = MatchType.ANY;
        filterOptions.ignoreTimeOfDay = true;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems[1].person.name).toBe('Goofy');
        expect(filteredItems[2].person.name).toBe('Minnie Mouse');
        expect(filteredItems[3].person.name).toBe('John Doe');
        expect(filteredItems.length).toBe(4);
      });
      it('should only return dates on or before February 2, 1902, NOT ignoring time of day', () => {
        filterOptions.variableIdentifiers = 'person.birthday';
        filterOptions.comparator = FilterComparator.IS_ON_OR_BEFORE_DATE;
        filterOptions.filterValue = new Date(1902, 1, 22, 2, 13, 20, 180);
        filterOptions.matchType = MatchType.ANY;
        filterOptions.ignoreTimeOfDay = false;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Goofy');
        expect(filteredItems[1].person.name).toBe('Minnie Mouse');
        expect(filteredItems[2].person.name).toBe('John Doe');
        expect(filteredItems.length).toBe(3);
      });
      it('should only return on or before after February 2, 1902, with variableMapper, not ignoring time of day', () => {
        filterOptions.variableIdentifiers = 'person.birthday';
        filterOptions.comparator = FilterComparator.IS_ON_OR_BEFORE_DATE;
        filterOptions.filterValue = new Date(1902, 1, 22, 1, 0, 0, 0);
        filterOptions.matchType = MatchType.ANY;
        filterOptions.ignoreTimeOfDay = false;
        filterOptions.variableMappers = (date: Date) => {
          date.setHours(23, 59, 59, 999);
          return date;
        }

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).not.toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Goofy');
        expect(filteredItems[1].person.name).toBe('John Doe');
        expect(filteredItems.length).toBe(2);
      });
    });

    describe('IS_TRUE filtering', () => {
      it('should find every male', () => {
        filterOptions.variableIdentifiers = 'person.isMale';
        filterOptions.comparator = FilterComparator.IS_TRUE;
        filterOptions.matchType = MatchType.ANY;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems[1].person.name).toBe('Goofy');
        expect(filteredItems[2].person.name).toBe('Bob Smith');
        expect(filteredItems[3].person.name).toBe('John Doe');
        expect(filteredItems.length).toBe(4);
      });
      it('should filter multiple with id <=1 on age with MatchType.ALL', () => {
        filterOptions.variableIdentifiers = ['person.isMale', null];
        filterOptions.comparator = FilterComparator.IS_TRUE;
        filterOptions.matchType = MatchType.ALL;
        filterOptions.variableMappers = [
          (isMale: number) => isMale,
          (item: any) => item.id <= 1 ? true : false
        ];
        const mapperSpy = spyOn(FilterComparator, 'getModifiedValue').and.callThrough();

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).not.toBeUndefined();
        expect(mapperSpy).toHaveBeenCalledTimes(2 * arrForCompare.length);
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems[1].person.name).toBe('Goofy');
        expect(filteredItems.length).toBe(2);
      });
    });

    describe('IS_FALSE filtering', () => {
      it('should find every male', () => {
        filterOptions.variableIdentifiers = 'person.isMale';
        filterOptions.comparator = FilterComparator.IS_FALSE;
        filterOptions.matchType = MatchType.ANY;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Minnie Mouse');
        expect(filteredItems.length).toBe(1);
      });
      it('should filter multiple with id <=1 on age with MatchType.ALL', () => {
        filterOptions.variableIdentifiers = ['person.isMale', null];
        filterOptions.comparator = FilterComparator.IS_FALSE;
        filterOptions.matchType = MatchType.ALL;
        filterOptions.variableMappers = [
          (isMale: number) => isMale,
          (item: any) => item.id <= 1 ? false : true
        ];
        const mapperSpy = spyOn(FilterComparator, 'getModifiedValue').and.callThrough();

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).not.toBeUndefined();
        expect(mapperSpy).toHaveBeenCalledTimes(2 * arrForCompare.length);
        expect(filteredItems.length).toBe(0);
      });
    });

    describe('IS_TRUTHY filtering', () => {
      it('should find all truthy values', () => {
        filterOptions.variableIdentifiers = null;
        filterOptions.comparator = FilterComparator.IS_TRUTHY;
        filterOptions.matchType = MatchType.ANY;

        const filteredItems = service.filterAndSortItems(truthyAndFalsyArrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0]).toBe('5');
        expect(filteredItems[1]).toEqual([]);
        expect(filteredItems.length).toBe(2);
      });
      it('should filter truthy variables with modifier', () => {
        filterOptions.variableIdentifiers = null;
        filterOptions.comparator = FilterComparator.IS_TRUTHY;
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableMappers = (item: any) => item === null ? true : item;

        const mapperSpy = spyOn(FilterComparator, 'getModifiedValue').and.callThrough();

        const filteredItems = service.filterAndSortItems(truthyAndFalsyArrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).not.toBeUndefined();
        expect(mapperSpy).toHaveBeenCalledTimes(truthyAndFalsyArrForCompare.length);
        expect(filteredItems[0]).toBe('5');
        expect(filteredItems[1]).toBe(null);
        expect(filteredItems[2]).toEqual([]);
        expect(filteredItems.length).toBe(3);
      });
    });

    describe('IS_FALSY filtering', () => {
      it('should find all falshy values', () => {
        filterOptions.variableIdentifiers = null;
        filterOptions.comparator = FilterComparator.IS_FALSY;
        filterOptions.matchType = MatchType.ANY;

        const filteredItems = service.filterAndSortItems(truthyAndFalsyArrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0]).toBe(false);
        expect(filteredItems[1]).toBe(0);
        expect(filteredItems[2]).toBe(-0);
        expect(filteredItems[3]).toBe("");
        expect(filteredItems[4]).toBe('');
        expect(filteredItems[5]).toBe(``);
        expect(filteredItems[6]).toBe(null);
        expect(filteredItems[7]).toEqual(NaN);
        expect(filteredItems[8]).toBe(undefined);
        expect(filteredItems[9]).toBe(document.all);
        expect(filteredItems.length).toBe(10);
      });
      it('should filter falsy variables with modifier', () => {
        filterOptions.variableIdentifiers = null;
        filterOptions.comparator = FilterComparator.IS_FALSY;
        filterOptions.matchType = MatchType.ANY;
        filterOptions.variableMappers = (item: any) => item === '5' ? false : item;

        const mapperSpy = spyOn(FilterComparator, 'getModifiedValue').and.callThrough();

        const filteredItems = service.filterAndSortItems(truthyAndFalsyArrForCompare.concat(), filterOptions, null);
        expect(filterOptions.variableMappers).not.toBeUndefined();
        expect(mapperSpy).toHaveBeenCalledTimes(truthyAndFalsyArrForCompare.length);
        expect(filteredItems[0]).toBe(false);
        expect(filteredItems[1]).toBe(0);
        expect(filteredItems[2]).toBe(-0);
        expect(filteredItems[3]).toBe("");
        expect(filteredItems[4]).toBe('5');
        expect(filteredItems[5]).toBe('');
        expect(filteredItems[6]).toBe(``);
        expect(filteredItems[7]).toBe(null);
        expect(filteredItems[8]).toEqual(NaN);
        expect(filteredItems[9]).toBe(undefined);
        expect(filteredItems[10]).toBe(document.all);
        expect(filteredItems.length).toBe(11);
      });
    });

    describe('Comparator-only function', () => {
      describe('getCurrentSortOptions', () => {
        it('should return the current sortOptions', () => {
          const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
          expect(Comparator.getCurrentSortOptions()).toBe(sortOptions);
        });
      });
      describe('getCurrentFilterOptions', () => {
        it('should return the current filterOptions', () => {
          const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
          expect(Comparator.getCurrentFilterOptions()).toBe(filterOptions);
        });
      });
      describe('isString', () => {
        it('should return true', () => {
          expect(Comparator.isString('hello')).toBe(true);
          expect(Comparator.isString('5')).toBe(true);
          expect(Comparator.isString('true')).toBe(true);
        });
        it('should return false', () => {
          expect(Comparator.isString(true)).toBe(false);
          expect(Comparator.isString({})).toBe(false);
          expect(Comparator.isString([])).toBe(false);
          expect(Comparator.isString(15)).toBe(false);
        });
      });
    });
    describe('FilterComparator-only functions', () => {
      describe('getRequiredMatches', () => {
        it('should only require one match on MatchType.ANY', () => {
          filterOptions.matchType = MatchType.ANY;
          service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
          expect(FilterComparator['getRequiredMatches'](1)).toBe(1);
          expect(FilterComparator['getRequiredMatches'](2)).toBe(1);
        });
        it('should require the same amount of matches as values on MatchType.ALL', () => {
          filterOptions.matchType = MatchType.ALL;
          service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);
          expect(FilterComparator['getRequiredMatches'](1)).toBe(1);
          expect(FilterComparator['getRequiredMatches'](2)).toBe(2);
        });
      });
      describe('escapeRegExp', () => {
        it('should escape regExp characters utitlized for regular expression logic', () => {
          //  [.*+?^${}()|[\]\\]
          expect(FilterComparator['escapeRegExp']('.')).toBe('\\.');
          expect(FilterComparator['escapeRegExp']('*')).toBe('\\*');
          expect(FilterComparator['escapeRegExp']('+')).toBe('\\+');
          expect(FilterComparator['escapeRegExp']('?')).toBe('\\?');
          expect(FilterComparator['escapeRegExp']('^')).toBe('\\^');
          expect(FilterComparator['escapeRegExp']('$')).toBe('\\$');
          expect(FilterComparator['escapeRegExp']('{')).toBe('\\{');
          expect(FilterComparator['escapeRegExp']('}')).toBe('\\}');
          expect(FilterComparator['escapeRegExp']('(')).toBe('\\(');
          expect(FilterComparator['escapeRegExp'](')')).toBe('\\)');
          expect(FilterComparator['escapeRegExp']('|')).toBe('\\|');
          expect(FilterComparator['escapeRegExp']('[')).toBe('\\[');
          expect(FilterComparator['escapeRegExp'](']')).toBe('\\]');
          expect(FilterComparator['escapeRegExp']('\\')).toBe('\\\\');
        })
      });
      describe('getModifiedValue', () => {
        it('should throw an error if the index exceeds array length', () => {
          expect(() => { FilterComparator.getModifiedValue('5', [num => num + '1'], 1) }).toThrowError('5 does not have a variable mapper assigned to it.');
        });
        it('should not throw an error if the index is within array length', () => {
          expect(() => { FilterComparator.getModifiedValue('5', [num => num + '1'], 0) }).not.toThrowError('5 does not have a variable mapper assigned to it.');
        });
        it('should call modifier function with array', () => {
          const ModifierObj = { modifier: num => num + '1' };
          const modifierSpy = spyOn(ModifierObj, 'modifier').and.callThrough();
          FilterComparator.getModifiedValue('5', [ModifierObj.modifier], 0);
          expect(modifierSpy).toHaveBeenCalled();
        });
        it('should call modifier function with function', () => {
          const ModifierObj = { modifier: num => num + '1' };
          const modifierSpy = spyOn(ModifierObj, 'modifier').and.callThrough();
          FilterComparator.getModifiedValue('5', ModifierObj.modifier, 0);
          expect(modifierSpy).toHaveBeenCalled();
        });
      });
    })
    it('should multifilter', () => {
      filterOptions.variableIdentifiers = 'person.birthday';
      filterOptions.comparator = FilterComparator.IS_ON_OR_AFTER_DATE;
      filterOptions.filterValue = new Date(1902, 1, 22, 0, 0, 0, 0);
      filterOptions.ignoreTimeOfDay = true;

      secondaryFilterOptions.variableIdentifiers = 'id';
      secondaryFilterOptions.comparator = FilterComparator.LESS_THAN;
      secondaryFilterOptions.filterValue = 4

      const arrForCompareCopy = arrForCompare.concat();
      const filteredItems = service.filterAndSortItems(arrForCompareCopy.concat(), [secondaryFilterOptions, filterOptions], null);

      expect(filteredItems[0].person.name).toBe('Mickey Mouse');
      expect(filteredItems[1].person.name).toBe('Minnie Mouse');
    });

    it('should single filter first, then single sort', () => {
      const filterSpy = spyOn(service, 'filterItemsByVarNames').and.callThrough();
      const sortSpy = spyOn(service, 'sortItemsByVarName').and.callThrough();
      const multisortSpy = spyOn(service, 'multiSortItemsByVarName').and.callThrough();
      const arrForCompareCopy = arrForCompare.concat();
      const filteredItems = service.filterAndSortItems(arrForCompareCopy.concat(), filterOptions, sortOptions);

      expect(filterSpy).toHaveBeenCalledBefore(sortSpy);
      expect(sortSpy).toHaveBeenCalled();
      expect(multisortSpy).not.toHaveBeenCalled();
    });

    it('should multifilter first, then single sort', () => {
      const filterSpy = spyOn(service, 'filterItemsByVarNames').and.callThrough();
      const sortSpy = spyOn(service, 'sortItemsByVarName').and.callThrough();
      const multisortSpy = spyOn(service, 'multiSortItemsByVarName').and.callThrough();
      const arrForCompareCopy = arrForCompare.concat();
      const filteredItems = service.filterAndSortItems(arrForCompareCopy.concat(), [filterOptions, secondaryFilterOptions], sortOptions);

      expect(filterSpy).toHaveBeenCalledBefore(sortSpy);
      expect(filterSpy).toHaveBeenCalledTimes(2)
      expect(sortSpy).toHaveBeenCalled();
      expect(multisortSpy).not.toHaveBeenCalled();
    });

    it('should multifilter first, then multisort', () => {
      const filterSpy = spyOn(service, 'filterItemsByVarNames').and.callThrough();
      const sortSpy = spyOn(service, 'sortItemsByVarName').and.callThrough();
      const multisortSpy = spyOn(service, 'multiSortItemsByVarName').and.callThrough();
      const arrForCompareCopy = arrForCompare.concat();
      const filteredItems = service.filterAndSortItems(arrForCompareCopy.concat(), [filterOptions, secondaryFilterOptions], [sortOptions, secondarySortOptions]);

      expect(filterSpy).toHaveBeenCalledBefore(multisortSpy);
      expect(filterSpy).toHaveBeenCalledTimes(2)
      expect(sortSpy).toHaveBeenCalledTimes(2);
      expect(multisortSpy).toHaveBeenCalled();
    });

    it('should honor sort order', () => {
        sortOptions.variableIdentifier = 'id';
        sortOptions.comparator = SortComparator.NUMERIC;
        sortOptions.sortDirection = SortDirection.ASCENDING;

        secondarySortOptions.variableIdentifier = 'person.name';
        secondarySortOptions.comparator = SortComparator.ALPHABETICAL;
        secondarySortOptions.sortDirection = SortDirection.ASCENDING;

        const arrForCompareCopy = arrForCompare.concat();
        const filteredItems = service.filterAndSortItems(arrForCompareCopy.concat(), null, [sortOptions, secondarySortOptions]);
  
        expect(filteredItems[0].person.name).toBe('Bob Smith');
        expect(filteredItems[1].person.name).toBe('Goofy');
        expect(filteredItems[2].person.name).toBe('John Doe');
        expect(filteredItems[3].person.name).toBe('Mickey Mouse');
        expect(filteredItems[4].person.name).toBe('Minnie Mouse');
    });

    describe('FilterSortService.isString', () => {
      it('should return true', () => {
        expect(service.isString('hello')).toBe(true);
        expect(service.isString('5')).toBe(true);
        expect(service.isString('true')).toBe(true);
      });
      it('should return false', () => {
        expect(service.isString(true)).toBe(false);
        expect(service.isString({})).toBe(false);
        expect(service.isString([])).toBe(false);
        expect(service.isString(15)).toBe(false);
      });
    });

    describe('currentFilterOptions', () => {
      it('should get the most recent sort options sorted', () => {
        filterOptions.variableIdentifiers = 'id';
        filterOptions.comparator = FilterComparator.EQUALS;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), filterOptions, null);

        expect(service.currentFilterOptions).toBe(filterOptions);
      });
    });

    describe('currentSortOptions', () => {
      it('should get the most recent sort options sorted', () => {
        sortOptions.variableIdentifier = 'id';
        sortOptions.comparator = SortComparator.NUMERIC;
        sortOptions.sortDirection = SortDirection.ASCENDING;

        const filteredItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);

        expect(service.currentSortOptions).toBe(sortOptions);
      });
    });

    describe('filterItemsByVarNames()', () => {
      it('should throw an error if the array is undefined', () => {
        let items: any[] | undefined = undefined;
        expect(() => { service.filterItemsByVarNames(items!, filterOptions) }).toThrowError('Item array is not defined. Please supply a defined array to filter.');
      });
      it('should throw an error if the array is null', () => {
        let items: any[] | null = null;
        expect(() => { service.filterItemsByVarNames(items!, filterOptions) }).toThrowError('Item array is not defined. Please supply a defined array to filter.');
      });
      it('should return the same array if the array length is 0', () => {
        const items1 = [];
        const items2 = service.filterItemsByVarNames(items1, filterOptions);
        expect(items1).toBe(items2);
      });
      it('should call splitVariablesFromIdentifier()', () => {
        const spy = spyOn(service, 'splitVariablesFromIdentifier').and.callThrough();
        filterOptions.variableIdentifiers = 'person.name';
        service.filterItemsByVarNames(arrForCompare.concat(), filterOptions);
        
        expect(spy).toHaveBeenCalledTimes(1);
      });
      it('should not call splitVariablesFromIdentifier()', () => {
        const spy = spyOn(service, 'splitVariablesFromIdentifier');
        filterOptions.variableIdentifiers = null;
        service.filterItemsByVarNames(wordsWithPunctuation.concat(), filterOptions);
        
        expect(spy).not.toHaveBeenCalled();
      });
      it('should filter items by variable name', () => {
        filterOptions.variableIdentifiers = 'person.isMale';
        filterOptions.comparator = FilterComparator.IS_TRUE;
        filterOptions.matchType = MatchType.ANY;

        const filteredItems = service.filterItemsByVarNames(arrForCompare.concat(), filterOptions);
        expect(filterOptions.variableMappers).toBeUndefined();
        expect(filteredItems[0].person.name).toBe('Mickey Mouse');
        expect(filteredItems[1].person.name).toBe('Goofy');
        expect(filteredItems[2].person.name).toBe('Bob Smith');
        expect(filteredItems[3].person.name).toBe('John Doe');
        expect(filteredItems.length).toBe(4);
      })
    });

    describe('splitVariablesFromIdentifier()', () => {
      describe('undefined, null, or \'\'', () => {
        it('should set splits to an empty array if no variable name is undefeind', () => {
          service.splitVariablesFromIdentifier(undefined);
          expect(service['splits']).toEqual([]);
        });
        it('should set splits to an empty array if no variable name is null', () => {
          service.splitVariablesFromIdentifier(null);
          expect(service['splits']).toEqual([]);
        });
        it('should set splits to an empty array if no variable name is an empty string', () => {
          service.splitVariablesFromIdentifier('');
          expect(service['splits']).toEqual([]);
        });
      });

      it('should properly split variable names with periods', () => {
        service.splitVariablesFromIdentifier('person.age');
        expect(service['splits']).toEqual(['person', 'age']);
        expect(service['varNames']).toEqual(['(array item)', '(array item).person', '(array item).person.age']);
      });

      it('should properly split variable names with brackets', () => {
        service.splitVariablesFromIdentifier('people[0].age');
        expect(service['splits']).toEqual(['people', '0', 'age']);
        expect(service['varNames']).toEqual(['(array item)', '(array item).people', '(array item).people[0]', '(array item).people[0].age']);
      });
      it('should properly split variable names that start with brackets', () => {
        service.splitVariablesFromIdentifier('[0].age');
        expect(service['splits']).toEqual(['0', 'age']);
        expect(service['varNames']).toEqual(['(array item)', '(array item)[0]', '(array item)[0].age']);
      });
    });

    describe('sortItemsByVarName', () => {
      it('should throw an error if the array is undefined', () => {
        let items: any[] | undefined = undefined;
        expect(() => { service.sortItemsByVarName(items!, sortOptions) }).toThrowError('Item array is not defined. Please supply a defined array to sort.');
      });
      it('should throw an error if the array is null', () => {
        let items: any[] | null = null;
        expect(() => { service.sortItemsByVarName(items!, sortOptions) }).toThrowError('Item array is not defined. Please supply a defined array to sort.');
      });
      it('should return the same array if the array length is 0', () => {
        const items1 = [];
        const items2 = service.sortItemsByVarName(items1, sortOptions);
        expect(items1).toBe(items2);
      });
      it('should not sort the array if sort direction is SortDirection.NONE' , () => {
        sortOptions.variableIdentifier = 'person.isMale';
        sortOptions.comparator = SortComparator.BOOLEAN;
        sortOptions.sortDirection = SortDirection.NONE;
        const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
        
        expect(sortedItems).toEqual(arrForCompare);
      });
      it('should sort the array ascending if sort direction is SortDirection.ASCENDING' , () => {
        sortOptions.variableIdentifier = 'person.isMale';
        sortOptions.comparator = SortComparator.BOOLEAN;
        sortOptions.sortDirection = SortDirection.ASCENDING;
        const sortedItems = service.filterAndSortItems(arrForCompare.concat(), null, sortOptions);
        
        expect(sortOptions.variableMapper).toBeUndefined();
        expect(sortedItems[0].person.name).toBe('Minnie Mouse');
        expect(sortedItems[1].person.name).toBe('Mickey Mouse');
        expect(sortedItems[2].person.name).toBe('Goofy');
        expect(sortedItems[3].person.name).toBe('Bob Smith');
        expect(sortedItems[4].person.name).toBe('John Doe');
      });
    });

    describe('multiSortItemsByVarName', () => {
      it('should put sort options in order of sortOptions.sortOrder', () => {
        sortOptions.variableIdentifier = 'person.birthday';
        sortOptions.comparator = SortComparator.DATE;
        sortOptions.sortDirection = SortDirection.ASCENDING;
        sortOptions.ignoreTimeOfDay = true;
        sortOptions.sortOrder = 0;

        secondarySortOptions.variableIdentifier = 'person.isMale';
        secondarySortOptions.comparator = SortComparator.BOOLEAN;
        secondarySortOptions.sortDirection = SortDirection.ASCENDING;
        secondarySortOptions.sortOrder = 1;

        const sortOptionsGroup: SortOptions[] = [secondarySortOptions, sortOptions];

        const arrForCompareCopy = arrForCompare.concat();
        const sortedItems = service.filterAndSortItems(arrForCompareCopy, null, sortOptionsGroup);

        expect(sortOptionsGroup).toEqual([sortOptions, secondarySortOptions]);
      });
      it('should put sort options in order of sortOptions.sortOrder, order shouldn\'t change', () => {
        sortOptions.variableIdentifier = 'person.birthday';
        sortOptions.comparator = SortComparator.DATE;
        sortOptions.sortDirection = SortDirection.ASCENDING;
        sortOptions.ignoreTimeOfDay = true;
        sortOptions.sortOrder = 1;

        secondarySortOptions.variableIdentifier = 'person.isMale';
        secondarySortOptions.comparator = SortComparator.BOOLEAN;
        secondarySortOptions.sortDirection = SortDirection.ASCENDING;
        secondarySortOptions.sortOrder = 0;

        const sortOptionsGroup: SortOptions[] = [secondarySortOptions, sortOptions];

        const arrForCompareCopy = arrForCompare.concat();
        const sortedItems = service.filterAndSortItems(arrForCompareCopy, null, sortOptionsGroup);

        expect(sortOptionsGroup).toEqual([secondarySortOptions, sortOptions]);
      });
    });

    describe('getFilterValuesFromPropertyIndentifiers', () => {
      it('should return the value sent in array of filterSplits length is 0', () => {
        service.filterSplits = [];
        const val = service.getFilterValuesFromPropertyIndentifiers(truthyAndFalsyArrForCompare[0]);
        expect(val).toEqual([false]);
      });
      it('should return the values of the item given variable names', () => {
        service.filterSplits = [['title'], ['description']]
        const val = service.getFilterValuesFromPropertyIndentifiers(stories[0]);
        expect(val).toEqual(['The Dog Who "Loved" Water', `[Abridged version] A big brown dog stepped into a warm river and went for a swim. (He swam slowly).  How happy was the dog?  Dogs should be happy. His name was Fido, wasn't it?`]);
      });
      it('should return the values of the item given dotted variable names', () => {
        service.filterSplits = [['person', 'name']]
        const val = service.getFilterValuesFromPropertyIndentifiers(arrForCompare[0]);
        expect(val).toEqual(['Mickey Mouse']);
      });
      it('should return the values of the item given array indexes and variable names', () => {
        service.filterSplits = [['person', 'data', '0']]
        const val = service.getFilterValuesFromPropertyIndentifiers(arrForCompare[0]);
        expect(val).toEqual([1]);
      });
      it('should throw an error when the property name is not recognized', () => {
        service.filterSplits = [['buttons']];
        service['varNames'] = ['(array item)', '(array item).buttons'];
        expect(() => { service.getFilterValuesFromPropertyIndentifiers(arrForCompare[0]) }).toThrowError(`Property buttons not found on (array item)`);
      });
    });

    describe('getSortValuesFromPropertyIdentifiers', () => {
      it('should return the value sent in array of sortSplits length is 0', () => {
        service['splits'] = [];
        const val = service.getSortValuesFromPropertyIdentifiers(truthyAndFalsyArrForCompare[0], truthyAndFalsyArrForCompare[1]);
        expect(val).toEqual([false, 0]);
      });
      it('should return the values of the item given variable names', () => {
        service['splits'] = ['title'];
        service['splitsLen'] = service['splits'].length;
        const val = service.getSortValuesFromPropertyIdentifiers(stories[0], stories[1]);
        expect(val).toEqual(['The Dog Who "Loved" Water', 'A Hot Dog Is a Sandwich']);
      });
      it('should return the values of the item given dotted variable names', () => {
        service['splits'] = ['person', 'name'];
        service['splitsLen'] = service['splits'].length;
        const val = service.getSortValuesFromPropertyIdentifiers(arrForCompare[0], arrForCompare[1]);
        expect(val).toEqual(['Mickey Mouse', 'Goofy']);
      });
      it('should return the values of the item given array indexes and variable names', () => {
        service['splits'] = ['person', 'gifts', '0'];
        service['splitsLen'] = service['splits'].length;
        const val = service.getSortValuesFromPropertyIdentifiers(arrForCompare[0], arrForCompare[1]);
        expect(val).toEqual(['roses', 'doggie bones']);
      });
      it('should throw an error when the property name is not recognized', () => {
        service['splits'] = [['buttons']];
        service['splitsLen'] = service['splits'].length;
        service['varNames'] = ['(array item)', '(array item).buttons'];
        expect(() => { service.getSortValuesFromPropertyIdentifiers(arrForCompare[0], arrForCompare[1]) }).toThrowError(`Property buttons not found on (array item)`);
      });
    });

    describe('itemsBeingFilteredAndSorted', () => {
      it('should allow use to get the current items being sorted and filtered', () => {
        sortOptions.variableIdentifier = 'person.isMale';
        sortOptions.comparator = SortComparator.BOOLEAN;
        sortOptions.sortDirection = SortDirection.ASCENDING;
        const arrForCompareCopy = arrForCompare.concat();
        const sortedItems = service.filterAndSortItems(arrForCompareCopy, null, sortOptions);
        
        expect(service.itemsBeingFilteredAndSorted).toBe(arrForCompareCopy);     
      }); 
    });
  });

});
