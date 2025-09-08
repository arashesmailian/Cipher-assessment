import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Meal } from '../models/meal.interface';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  private recipeService = inject(RecipeService);

  searchQuery = '';
  meals: Meal[] = [];
  isLoading = false;
  hasSearched = false;
  private searchSubject = new Subject<string>();

  ngOnInit() {
    // Set up debounced search to avoid excessive API calls while user is typing
    this.searchSubject
      .pipe(
        debounceTime(300), // Wait 300ms after user stops typing
        distinctUntilChanged(), // Only search if query actually changed
        switchMap((query) => {
          // Cancel previous request if new one comes in
          this.isLoading = true;
          this.hasSearched = true;
          return this.recipeService.searchMeals(query);
        })
      )
      .subscribe({
        next: (meals) => {
          this.meals = meals;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Search error:', error);
          this.meals = [];
          this.isLoading = false;
        },
      });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.searchSubject.next(this.searchQuery);
    } else {
      this.meals = [];
      this.hasSearched = false;
    }
  }

  getIngredientsList(meal: Meal): string {
    // Show only first 3 ingredients as a preview on recipe cards
    return this.recipeService
      .extractIngredients(meal)
      .slice(0, 3)
      .map((i) => i.name)
      .join(', ');
  }

  getPlaceholderImage(): string {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
  }
}
