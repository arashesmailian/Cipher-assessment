import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError } from 'rxjs';
import { Meal, MealSearchResponse, Ingredient } from '../models/meal.interface';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly http = inject(HttpClient);
  private readonly API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

  /**
   * Search for meals by name
   * @param query - Search query string
   * @returns Observable of meals array
   */
  searchMeals(query: string): Observable<Meal[]> {
    if (!query || query.trim().length === 0) {
      return of([]);
    }

    const url = `${this.API_BASE_URL}/search.php?s=${encodeURIComponent(query.trim())}`;

    return this.http.get<MealSearchResponse>(url).pipe(
      map((response) => response.meals || []),
      catchError((error) => {
        console.error('Error searching meals:', error);
        return of([]);
      })
    );
  }

  /**
   * Get meal details by ID
   * @param id - Meal ID
   * @returns Observable of meal details
   */
  getMealById(id: string): Observable<Meal | null> {
    if (!id) {
      return of(null);
    }

    const url = `${this.API_BASE_URL}/lookup.php?i=${id}`;

    return this.http.get<MealSearchResponse>(url).pipe(
      map((response) => (response.meals ? response.meals[0] : null)),
      catchError((error) => {
        console.error('Error fetching meal details:', error);
        return of(null);
      })
    );
  }

  /**
   * Extract ingredients and measures from meal object
   * @param meal - Meal object
   * @returns Array of ingredients with measures
   */
  extractIngredients(meal: Meal): Ingredient[] {
    const ingredients: Ingredient[] = [];

    for (let i = 1; i <= 20; i++) {
      const ingredientKey = `strIngredient${i}` as keyof Meal;
      const measureKey = `strMeasure${i}` as keyof Meal;

      const ingredient = meal[ingredientKey] as string;
      const measure = meal[measureKey] as string;

      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient.trim(),
          measure: measure ? measure.trim() : '',
        });
      }
    }

    return ingredients;
  }

  /**
   * Get a brief description from ingredients
   * @param meal - Meal object
   * @returns Brief description string
   */
  getBriefDescription(meal: Meal): string {
    const ingredients = this.extractIngredients(meal);
    const mainIngredients = ingredients
      .slice(0, 3)
      .map((i) => i.name)
      .join(', ');
    return `${meal.strArea} ${meal.strCategory} with ${mainIngredients}`;
  }
}
