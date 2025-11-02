import type {Food} from '../../types/index'

const basePath = import.meta.env.BASE_URL

export const foods: Food[] = [
  {
    id: 1,
    name: 'Pizza',
    image: `${basePath}pizza.png`,
  },
  {
    id: 3,
    name: 'Cheese Burger',
    image: `${basePath}cheese-burger.png`,
  },
  {
    id: 4,
    name: 'Biryani',
    image: `${basePath}bryani.png`,
  },
]
