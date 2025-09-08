import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Recipe Explorer - Find Delicious Recipes',
  },
  {
    path: 'recipe/:id',
    component: RecipeDetailComponent,
    title: 'Recipe Details',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
