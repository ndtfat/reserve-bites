import { IMenuCategory } from '../types/restaurant.type';

export function findMaxPrice(menu: IMenuCategory[]) {
  const allDishes = menu.flatMap((categery) => categery.dishes);
  return Math.max(...allDishes.map((dish) => dish.price));
}

export function findMinPrice(menu: IMenuCategory[]) {
  const allDishes = menu.flatMap((categery) => categery.dishes);
  return Math.min(...allDishes.map((dish) => dish.price));
}
