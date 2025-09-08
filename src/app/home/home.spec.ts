import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { HomeComponent } from './home';
import { RecipeService } from '../services/recipe.service';
import { Meal } from '../models/meal.interface';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let recipeService: jasmine.SpyObj<RecipeService>;

  const mockMeals: Meal[] = [
    {
      idMeal: '52772',
      strMeal: 'Teriyaki Chicken',
      strCategory: 'Chicken',
      strArea: 'Japanese',
      strInstructions: 'Cook chicken...',
      strMealThumb: 'https://example.com/image.jpg',
      strMealAlternate: null,
      strTags: null,
      strYoutube: '',
      strSource: null,
      strImageSource: null,
      strCreativeCommonsConfirmed: null,
      dateModified: null,
      strIngredient1: 'Chicken',
      strMeasure1: '2 pieces',
    } as Meal,
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('RecipeService', ['searchMeals', 'extractIngredients']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, RouterTestingModule, HomeComponent],
      providers: [{ provide: RecipeService, useValue: spy }],
    }).compileComponents();

    recipeService = TestBed.inject(RecipeService) as jasmine.SpyObj<RecipeService>;
    recipeService.searchMeals.and.returnValue(of(mockMeals));
    recipeService.extractIngredients.and.returnValue([
      { name: 'Chicken', measure: '2 pieces' },
      { name: 'Soy Sauce', measure: '1/4 cup' },
    ]);

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty search and no results', () => {
    expect(component.searchQuery).toBe('');
    expect(component.meals).toEqual([]);
    expect(component.isLoading).toBe(false);
    expect(component.hasSearched).toBe(false);
  });

  it('should search for meals when search query is entered', (done) => {
    component.searchQuery = 'chicken';
    component.onSearch();

    // Wait for debounce
    setTimeout(() => {
      expect(recipeService.searchMeals).toHaveBeenCalledWith('chicken');
      expect(component.meals).toEqual(mockMeals);
      expect(component.isLoading).toBe(false);
      expect(component.hasSearched).toBe(true);
      done();
    }, 350);
  });

  it('should clear results when search query is empty', () => {
    component.meals = mockMeals;
    component.hasSearched = true;
    component.searchQuery = '';
    component.onSearch();

    expect(component.meals).toEqual([]);
    expect(component.hasSearched).toBe(false);
  });

  it('should get ingredients list for a meal', () => {
    const meal = mockMeals[0];
    const result = component.getIngredientsList(meal);

    expect(recipeService.extractIngredients).toHaveBeenCalledWith(meal);
    expect(result).toBe('Chicken, Soy Sauce');
  });

  it('should provide placeholder image URL', () => {
    const placeholder = component.getPlaceholderImage();
    expect(placeholder).toContain('data:image/svg+xml');
  });

  it('should debounce search input', (done) => {
    // First search
    component.searchQuery = 'ch';
    component.onSearch();

    // Quick second search (should be debounced)
    setTimeout(() => {
      component.searchQuery = 'chi';
      component.onSearch();
    }, 100);

    // Quick third search (should be debounced)
    setTimeout(() => {
      component.searchQuery = 'chicken';
      component.onSearch();
    }, 200);

    // Check that only the last search was executed
    setTimeout(() => {
      expect(recipeService.searchMeals).toHaveBeenCalledTimes(1);
      expect(recipeService.searchMeals).toHaveBeenCalledWith('chicken');
      done();
    }, 650);
  });
});
