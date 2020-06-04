const persons = require('./people.json');

function getPeopleNames(people) {
  return people.map(person => person.name);
}

function getPeopleLiveDurtions(people) {
  return people.map(person => person.died - person.born);
}

function getChildren(people, person) {
  // return people.filter(child => child.mother === person.name || child.father === person.name);
  const isChild = person.sex === 'f'
    ? child => child.mother === person.name
    : child => child.father === person.name;

  return people.filter(isChild);
}

function getFather(people, person) {
  return people.find(father => father.name === person.father);
}

function getWomenDiedBefore1800(people) {
  return people.filter(person => person.sex === 'f' && person.died < 1800);
}

function getPeopleLivedForAtLeast65Years(people) {
  return people.filter(person => (person.died - person.born) >= 65);
}

function createLeavedForAtLeastFilter(age) {
  return person => person.died - person.born >= age;
}

function getPeopleWithLiveDurtions(people) {
  return people.map(person => {
    return {
      ...person,
      liveDuration: person.died - person.born,
    };
  });
}

function getPeopleWithCentury(people) {
  return people.map(person => {
    return {
      ...person,
      century: Math.ceil(person.died / 100),
    };
  });
}

// Advanced optimized solution below 👇🏽
function getPeopleWithChildren(people) {
  return people.map(person => {
    return {
      ...person,
      children: getChildren(people, person),
    };
  });
}

/**
 * Колбек для reduce, який генерує наступну структуру даних
 * Ключі, як кодування статі('m' | 'f') для зручності використання
 * {
 *   // жінки
 *   f: {
 *     // ключ - ім'я людини, значення - масив її дітей
 *     [name]: [...],
 *   },
 *   // чоловіки
 *   m: {
 *     [name]: [...],
 *   },
 * }
 * @param {*} children (acc)
 * @param {*} person (current)
 */
function groupChildrenBySexAndName(children, person) {
  const motherName = person.mother;
  const fatherName = person.father;

  if (children.f[motherName]) {
    children.f[motherName].push(person);
  } else {
    children.f[motherName] = [person];
  }

  if (children.m[fatherName]) {
    children.m[fatherName].push(person);
  } else {
    children.m[fatherName] = [person];
  }

  return children;
}

function getPeopleWithChildrenAdvanced(people) {
  const children = people.reduce(groupChildrenBySexAndName, { f: {}, m: {} });

  return people.map(person => {
    return {
      ...person,
      children: children[person.sex][person.name],
    };
  });
}

function sortByBorn(people) {
  return [...people]
    .sort((personA, personB) => personA.born - personB.born);
}

function sortByName(people) {
  return [...people]
    .sort((personA, personB) => personA.name.localeCompare(personB.name));
}

function sortByAge(people) {
  const compareAges = (personA, personB) => {
    const ageA = personA.died - personA.born;
    const ageB = personB.died - personB.born;

    return ageA - ageB;
  };

  return [...people].sort(compareAges);
}

function createSorterBy(field) {
  let compare;

  switch (field) {
    case 'name':
      compare = (personA, personB) => personA.name.localeCompare(personB.name);
      break;
    case 'died':
    case 'born':
      compare = (personA, personB) => personA[field] - personB[field];
      break;
    default:
      throw new Error(`${field} is not supported`);
  }

  return compare;
}


console.log(JSON.stringify(getPeopleWithChildrenAdvanced(persons), null, 2));
