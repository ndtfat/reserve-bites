import { Route } from '@angular/router';
import { RestaurantComponent } from '../pages/restaurant/restaurant.component';
import { SearchComponent } from '../pages/restaurant/search.component';

export const RESTAURANT_ROUTES: Route[] = [
  {
    path: '',
    children: [
      { path: 'search', component: SearchComponent },
      { path: ':id', component: RestaurantComponent },
    ],
  },
];
