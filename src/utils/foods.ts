export interface Food {
  id: number
  name: string
  image: string
}

export const foods: Food[] = [
  {
    id: 1,
    name: 'Pizza',
    image: './pizza.png',
  },
  {
    id: 3,
    name: 'Cheese Burger',
    image: './cheese-burger.png',
  },
  {
    id: 4,
    name: 'Biryani',
    image: './bryani.png',
  },
]
