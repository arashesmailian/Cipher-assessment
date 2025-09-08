import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Meal, Ingredient } from '../models/meal.interface';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-recipe-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss',
})
export class RecipeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);

  meal: Meal | null = null;
  ingredients: Ingredient[] = [];
  isLoading = true;
  error = false;

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          const id = params['id'];
          return this.recipeService.getMealById(id);
        })
      )
      .subscribe({
        next: (meal) => {
          this.meal = meal;
          if (meal) {
            this.ingredients = this.recipeService.extractIngredients(meal);
          }
          this.isLoading = false;
          this.error = !meal;
        },
        error: (err) => {
          console.error('Error loading recipe:', err);
          this.isLoading = false;
          this.error = true;
        },
      });
  }

  getInstructions(): string[] {
    if (!this.meal?.strInstructions) return [];

    // Split instructions by double line breaks to separate steps
    // Handles different line ending formats: Windows (\r\n), Unix (\n), and mixed
    return this.meal.strInstructions
      .split(/\r\n\r\n|\n\n|\r\n/)
      .filter((step) => step.trim())
      .map((step) => step.trim());
  }

  getPlaceholderImage(): string {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZSBBdmFpbGFibGU8L3RleHQ+PC9zdmc+';
  }
}
