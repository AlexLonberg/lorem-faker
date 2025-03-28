/** Список имен. */
const maleNames = Object.freeze([
  'Liam',
  'Noah',
  'Oliver',
  'James',
  'Elijah',
  'Theodore',
  'Henry',
  'Lucas',
  'William',
  'Benjamin',
  'Levi',
  'Sebastian',
  'Jack',
  'Ezra',
  'Michael',
  'Daniel',
  'Leo',
  'Owen',
  'Samuel',
  'Hudson',
  'Alexander',
  'Asher',
  'Ethan',
  'John',
  'David',
  'Jackson',
  'Joseph',
  'Mason',
  'Luke',
  'Matthew',
  'Julian',
  'Dylan',
  'Elias',
  'Jacob',
  'Maverick',
  'Gabriel',
  'Logan',
  'Thomas',
  'Isaac',
  'Miles',
  'Grayson',
  'Santiago',
  'Anthony',
  'Wyatt',
  'Carter',
  'Jayden',
  'Ezekiel',
  'Caleb',
  'Cooper',
  'Josiah',
  'Charles',
  'Christopher',
  'Isaiah',
  'Nolan',
  'Cameron',
  'Nathan',
  'Joshua',
  'Kai',
  'Waylon',
  'Angel',
  'Lincoln',
  'Andrew',
  'Roman',
  'Adrian',
  'Aaron',
  'Wesley',
  'Ian',
  'Axel',
  'Brooks',
  'Bennett',
  'Weston',
  'Rowan',
  'Christian',
  'Beau',
  'Eli',
  'Silas',
  'Jonathan',
  'Ryan',
  'Leonardo',
  'Walker',
  'Micah',
  'Everett',
  'Robert',
  'Parker',
  'Jeremiah',
  'Jose',
  'Colton',
  'Landon',
  'Jordan',
  'Amir',
  'Gael',
  'Austin',
  'Adam',
  'Jameson',
  'August',
  'Xavier',
  'Myles',
  'Dominic',
  'Damian',
  'Nicholas',
  'Carson',
  'Atlas',
  'Kayden',
  'Hunter',
  'River',
  'Greyson',
  'Emmett',
  'Harrison',
  'Vincent',
  'Milo',
  'Jasper',
  'Giovanni',
  'Jonah',
  'Zion',
  'Connor',
  'Sawyer',
  'Arthur',
  'Ryder',
  'Archer',
  'Lorenzo',
  'Declan',
  'Luis',
  'Diego',
  'George',
  'Evan',
  'Carlos',
  'Graham',
  'Juan',
  'Kingston',
  'Nathaniel',
  'Legend',
  'Malachi',
  'Jason',
  'Leon',
  'Dawson',
  'Calvin',
  'Ivan',
  'Chase',
  'Cole',
  'Ashton',
  'Ace',
  'Arlo',
  'Dean',
  'Brayden',
  'Jude',
  'Hayden',
  'Max',
  'Matias',
  'Elliott',
  'Alan',
  'Zachary',
  'Jesus',
  'Emmanuel',
  'Adonis',
  'Charlie',
  'Judah',
  'Tyler',
  'Elliot',
  'Antonio',
  'Emilio',
  'Camden',
  'Stetson',
  'Maxwell',
  'Justin',
  'Kevin',
  'Messiah',
  'Finn',
  'Bentley',
  'Felix',
  'Nicolas',
  'Miguel',
  'Maddox',
  'Beckett',
  'Tate',
  'Beckham',
  'Andres',
  'Alejandro',
  'Alex',
  'Jesse',
  'Tucker',
  'Barrett',
  'Knox',
  'Hayes',
  'Peter',
  'Timothy',
  'Joel',
  'Edward',
  'Griffin',
  'Oscar',
  'Victor',
  'Abraham',
  'Brandon',
  'Abel',
  'Richard',
  'Riley',
  'Patrick',
  'Eric',
  'Grant',
  'Israel',
  'Milan',
  'Gavin',
  'Rafael',
  'Tatum',
  'Kyrie',
  'Louis',
  'Javier',
  'Avery',
  'Rory',
  'Ismael',
  'Jeremy',
  'Cohen',
  'Simon',
  'Marcus',
  'Steven',
  'Mark',
  'Dallas',
  'Tristan',
  'Lane',
  'Blake',
  'Paul',
  'Paxton',
  'Bryce',
  'Nash',
  'Crew',
  'Kenneth',
  'Omar',
  'Colt',
  'King',
  'Walter',
  'Emerson',
  'Phoenix',
  'Jaylen',
  'Derek',
  'Muhammad',
  'Ellis',
  'Preston',
  'Jorge',
  'Zane',
  'Kayson',
  'Cade',
  'Tobias',
  'Otto',
  'Remington',
  'Finley',
  'Holden',
  'Jax',
  'Cash',
  'Martin',
  'Malcolm',
  'Romeo',
  'Josue',
  'Francisco',
  'Cyrus',
  'Koa',
  'Angelo',
  'Jensen',
  'Erick',
  'Hendrix',
  'Warren',
  'Bryan',
  'Cody',
  'Leonel',
  'Onyx',
  'Ali',
  'Andre',
  'Clayton',
  'Saint',
  'Dante',
  'Reid',
  'Casey',
  'Brian',
  'Gideon',
  'Maximus',
  'Colter',
  'Brady',
  'Cayden',
  'Harvey',
  'Cruz',
  'Dakota',
  'Damien',
  'Manuel',
  'Anderson',
  'Cairo',
  'Colin',
  'Joaquin',
  'Callan',
  'Briggs',
  'Wade',
  'Jared',
  'Fernando',
  'Ari',
  'Colson',
  'Archie',
  'Banks',
  'Bowen',
  'Sonny',
  'Eduardo',
  'Sullivan',
  'Bradley',
  'Raymond',
  'Odin',
  'Spencer',
  'Stephen',
  'Prince',
  'Brantley',
  'Killian',
  'Cesar',
  'Mathias',
  'Ricardo',
  'Orion',
  'Titus',
  'Luciano',
  'Pablo',
  'Chance',
  'Travis',
  'Marco',
  'Jay',
  'Hector',
  'Edwin',
  'Armani',
  'Shiloh',
  'Marshall',
  'Russell',
  'Baylor',
  'Kameron',
  'Tyson',
  'Grady',
  'Oakley',
  'Baker',
  'Winston',
  'Kane',
  'Julius',
  'Desmond',
  'Royal',
  'Sterling',
  'Mario',
  'Sergio',
  'Jake',
  'Shepherd',
  'Franklin',
  'Ares',
  'Lawson',
  'Hugo',
  'Kyle',
  'Kobe',
  'Pedro',
  'Wilder',
  'Sage',
  'Damon',
  'Sean',
  'Forrest',
  'Reed',
  'Tanner',
  'Apollo',
  'Nehemiah',
  'Edgar',
  'Johnny',
  'Clark',
  'Eden',
  'Gunner',
  'Isaias',
  'Esteban',
  'Hank',
  'Solomon',
  'Wells',
  'Sutton',
  'Royce',
  'Callen',
  'Noel',
  'Quinn',
  'Raphael',
  'Corbin',
  'Erik',
  'Atreus',
  'Francis',
  'Callahan',
  'Devin',
  'Troy',
  'Fabian',
  'Zaire',
  'Donovan',
  'Johnathan',
  'Frank',
  'Lewis',
  'Adan',
  'Alexis',
  'Marcos',
  'Leonidas',
  'Kendrick',
  'Ruben',
  'Camilo',
  'Garrett',
  'Matthias',
  'Emanuel',
  'Jeffrey',
  'Collin',
  'Lucian',
  'Augustus',
  'Memphis',
  'Finnegan',
  'Lionel',
  'Caiden',
  'Rodrigo',
  'Uriel',
  'Lucca',
  'Philip',
  'Andy',
  'Jaiden',
  'Porter',
  'Ridge',
  'Frederick',
  'Rocco',
  'Asa',
  'Denver',
  'Dalton',
  'Major',
  'Valentino',
  'Allen',
  'Ariel',
  'Rome',
  'Ford',
  'Leland',
  'Marcelo',
  'Seth',
  'Miller',
  'Roberto',
  'Gregory',
  'Hezekiah',
  'Jonas',
  'Deacon',
  'Alonzo',
  'Moises',
  'Conrad',
  'Drew',
  'Bruce',
  'Mohamed',
  'Anakin',
  'Mack',
  'Pierce',
  'Princeton',
  'Trevor',
  'Morgan',
  'Roy',
  'Dominick',
  'Shane',
  'Hamza',
  'Moses',
  'Dax',
  'Lawrence',
  'Ledger',
  'Enrique',
  'Saul',
  'Armando',
  'Kaysen',
  'Samson',
  'Maximilian',
  'Rio',
  'Braylen',
  'Julio',
  'Mohammad',
  'Cassius',
  'Maximo',
  'Clay',
  'Emir',
  'Jaime',
  'Gerardo',
  'Zachariah',
  'Jayson',
  'Albert',
  'Taylor',
  'Sincere',
  'Gunnar',
  'Boone',
  'Raul',
  'Jamie',
  'Scott',
  'Danny',
  'Colby',
  'Nikolai',
  'Dorian',
  'Ocean',
  'Louie',
  'Layton',
  'Ronald',
  'Benson',
  'Davis',
  'Huxley',
  'Mohammed',
  'Arturo',
  'Phillip',
  'Augustine',
  'Reign',
  'Kareem',
  'Vicente',
  'Salem',
  'Reese',
  'Fletcher',
  'Shawn',
  'Braylon',
  'Alden',
  'Julien',
  'Cannon',
  'Gustavo',
  'Boston',
  'Zeke',
  'Corey',
  'Dennis',
  'Madden',
  'Marvin',
  'Ahmed',
  'Mac',
  'Otis',
  'Harlan',
  'Donald',
  'Amos',
  'Jamison',
  'Dario',
  'Roland',
  'Caspian',
  'Finnley',
  'Raylan',
  'Mauricio',
  'Briar',
  'Wilson',
  'Chosen',
  'Sam',
  'Tru',
  'Trace',
  'Waylen',
  'Quincy',
  'Santana',
  'Creed',
  'Westley',
  'Amias',
  'Azrael',
  'Drake',
  'Duke',
  'Ahmad',
  'Chandler',
  'Hassan',
  'Houston',
  'Tommy',
  'Eliseo',
  'Dustin',
  'Leonard',
  'Dexter',
  'Salvador',
  'Uriah',
  'Lee',
  'Rhodes',
  'Bruno',
  'Case',
  'Valentin',
  'Abram',
  'Cal',
  'Keith',
  'Alvaro',
  'Enoch',
  'Trey',
  'Clyde',
  'Nathanael',
  'Rex',
  'Tomas',
  'Darius',
  'Gage',
  'Riggs',
  'Wayne',
  'Junior',
  'Aryan',
  'Carmelo',
  'Conner',
  'Alberto',
  'Alfredo',
  'Loyal',
  'Douglas',
  'Aron',
  'Forest',
  'Avi',
  'Bellamy',
  'Emery',
  'Bridger',
  'Brock',
  'Lennon',
  'Derrick',
  'Roger',
  'Marcel',
  'Rayden',
  'Jefferson',
  'Alvin',
  'Kaiser',
  'Blaze',
  'Dillon',
  'Magnus',
  'Quentin',
  'Ray',
  'Abdullah',
  'Chris',
  'Orlando',
  'Franco',
  'Evander',
  'Flynn',
  'Harry',
  'Robin',
  'Hugh',
  'Aries',
  'Ambrose',
  'Issac',
  'Cayson',
  'Rey',
  'Santos',
  'Ben',
  'Nelson',
  'Wes',
  'Seven',
  'Watson',
  'Gatlin',
  'Stanley',
  'Allan',
  'Landen',
  'Neil',
  'Quinton',
  'Noe',
  'Reuben',
  'Bear',
  'Jimmy',
  'Kannon',
  'Lance',
  'Melvin',
  'Lochlan',
  'Arian',
  'Legacy',
  'Edison',
  'Emory',
  'Rudy',
  'Aden',
  'Byron',
  'Dereck',
  'Everest',
  'Guillermo',
  'Alec',
  'Brodie',
  'Massimo',
  'Mitchell',
  'Anders',
  'Tony',
  'Kingsley',
  'Jerry',
  'Ramon',
  'Jagger',
  'Elisha',
  'Teo',
  'Eddie',
  'Judson',
  'Leif',
  'Trenton',
  'Grey',
  'Felipe',
  'Ernesto',
  'Ricky',
  'Fisher',
  'Keaton',
  'Marcellus',
  'Leroy',
  'Ignacio',
  'Ira',
  'Zev',
  'Aurelio',
  'Brendan',
  'Jericho',
  'Nixon',
  'Demetrius',
  'Rocky',
  'Mathew',
  'Murphy',
  'Axl',
  'Dane',
  'Justice',
  'Thaddeus',
  'Curtis',
  'Dash',
  'Devon',
  'Joe',
  'Joey',
  'Jon',
  'Harlem',
  'Salvatore',
  'Van',
  'Zechariah',
  'Coleson',
  'Eugene',
  'Alistair',
  'Colten',
  'Lucien',
  'Cain',
  'Harold',
  'Alfred',
  'Benedict',
  'Duncan',
  'Zen',
  'Kye'
] as const)

export {
  maleNames
}
