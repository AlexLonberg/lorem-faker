import { randomInt } from './utils.js'

/** Список животных(без составных слов) */
const animals = Object.freeze([
  'aardvark',
  'albatross',
  'alligator',
  'alpaca',
  'ant',
  'anteater',
  'antelope',
  'ape',
  'armadillo',
  'baboon',
  'badger',
  'barracuda',
  'bat',
  'bear',
  'beaver',
  'bee',
  'bison',
  'boar',
  'buffalo',
  'butterfly',
  'camel',
  'capybara',
  'caribou',
  'cassowary',
  'cat',
  'caterpillar',
  'cattle',
  'chamois',
  'cheetah',
  'chicken',
  'chimpanzee',
  'chinchilla',
  'chough',
  'clam',
  'cobra',
  'cockroach',
  'cod',
  'cormorant',
  'coyote',
  'crab',
  'crane',
  'crocodile',
  'crow',
  'curlew',
  'deer',
  'dinosaur',
  'dog',
  'dogfish',
  'dolphin',
  'donkey',
  'dotterel',
  'dove',
  'dragonfly',
  'duck',
  'dugong',
  'dunlin',
  'eagle',
  'echidna',
  'eel',
  'eland',
  'elephant',
  'elk',
  'emu',
  'falcon',
  'ferret',
  'finch',
  'fish',
  'flamingo',
  'fly',
  'fox',
  'frog',
  'gaur',
  'gazelle',
  'gerbil',
  'giraffe',
  'gnat',
  'gnu',
  'goat',
  'goose',
  'goldfinch',
  'goldfish',
  'gorilla',
  'goshawk',
  'grasshopper',
  'grouse',
  'guanaco',
  'gull',
  'hamster',
  'hare',
  'hawk',
  'hedgehog',
  'heron',
  'herring',
  'hippopotamus',
  'hornet',
  'horse',
  'human',
  'hummingbird',
  'hyena',
  'ibex',
  'ibis',
  'jackal',
  'jaguar',
  'jay',
  'jellyfish',
  'kangaroo',
  'kingfisher',
  'koala',
  'kookaburra',
  'kudu',
  'lapwing',
  'lark',
  'lemur',
  'leopard',
  'lion',
  'llama',
  'lobster',
  'locust',
  'loris',
  'louse',
  'lyrebird',
  'magpie',
  'mallard',
  'manatee',
  'mandrill',
  'mantis',
  'marten',
  'meerkat',
  'mink',
  'mole',
  'mongoose',
  'monkey',
  'moose',
  'mouse',
  'mosquito',
  'mule',
  'narwhal',
  'newt',
  'nightingale',
  'octopus',
  'okapi',
  'opossum',
  'oryx',
  'ostrich',
  'otter',
  'owl',
  'ox',
  'oyster',
  'panther',
  'parrot',
  'partridge',
  'peafowl',
  'pelican',
  'penguin',
  'pheasant',
  'pig',
  'pigeon',
  'pony',
  'porcupine',
  'porpoise',
  'quail',
  'quelea',
  'quetzal',
  'rabbit',
  'raccoon',
  'rail',
  'ram',
  'rat',
  'raven',
  'reindeer',
  'rhinoceros',
  'rook',
  'salamander',
  'salmon',
  'sandpiper',
  'sardine',
  'scorpion',
  'seahorse',
  'seal',
  'shark',
  'sheep',
  'shrew',
  'skunk',
  'snail',
  'snake',
  'sparrow',
  'spider',
  'spoonbill',
  'squid',
  'squirrel',
  'starling',
  'stingray',
  'stinkbug',
  'stork',
  'swallow',
  'swan',
  'tapir',
  'tarsier',
  'termite',
  'tiger',
  'toad',
  'trout',
  'turkey',
  'turtle',
  'vicuña',
  'viper',
  'vulture',
  'wallaby',
  'walrus',
  'wasp',
  'weasel',
  'whale',
  'wolf',
  'wolverine',
  'wombat',
  'woodcock',
  'woodpecker',
  'worm',
  'wren',
  'yak',
  'zebra'
] as const)
/** Список животных(без составных слов) */
type TAnimal = typeof animals[number]

/**
 * Случайное животное из набора {@link animals}.
 */
function animal (): TAnimal {
  return animals[randomInt(0, animals.length - 1)]!
}

export {
  animals,
  type TAnimal,
  animal
}
