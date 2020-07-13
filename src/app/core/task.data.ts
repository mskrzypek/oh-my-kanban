export const TASKS: Array<object> = [
  {
    id: 1,
    name: 'Przeczytać dokumentację Angulara',
    status: 1,
    description: 'Dokumentacja on-line: https://angular.io/docs',
    deadline: '2020-07-31',
    priority: 0
  },
  {
    id: 2,
    name: 'Oddać książki do biblioteki',
    // lack of some not required properties is ok
  },
  {
    id: 3,
    name: 'Opłacić podatki',
    status: 0,
    description: '+ zaległe rachunki',
    deadline: '2020-08-10',
    priority: 1
  },
  {
    id: 4,
    name: 'Zapisać się na siłownię',
    status: 0,
    description: '',
    deadline: '',
    priority: -1
  },
  {
    id: 5,
    name: 'Napisać aplikację To-do',
    status: 2,
    description: 'Wykorzystując framework Angular stworzyć aplikację służącą do definiowania oraz edytowania utworzonych wcześniej zadań do wykonania z podglądem grupującym zadania ze względu na statusy (do zrobienia, w toku, gotowe), terminami, priorytetami i zmianą statusu zadań poprzez przenoszenie ich metodą drag and drop.',
    deadline: '',
    priority: 1
  },
  {
    id: 6,
    name: 'Zrobić remont pokoju dziecięcego',
    status: 1,
    description: 'Pomalować sufit i ściany, kupić nowe meble.',
    deadline: '',
    priority: -1
  }
];
