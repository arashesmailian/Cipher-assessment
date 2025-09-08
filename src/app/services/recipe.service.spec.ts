import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RecipeService } from './recipe.service';
import { Meal, MealSearchResponse } from '../models/meal.interface';

describe('RecipeService', () => {
  let service: RecipeService;
  let httpMock: HttpTestingController;
  const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RecipeService],
    });
    service = TestBed.inject(RecipeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('searchMeals', () => {
    it('should return meals when search is successful', (done) => {
      const mockResponse: MealSearchResponse = {
        meals: [
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
          },
        ],
      };

      service.searchMeals('chicken').subscribe((meals) => {
        expect(meals.length).toBe(1);
        expect(meals[0].strMeal).toBe('Teriyaki Chicken');
        done();
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/search.php?s=chicken`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return empty array for empty query', (done) => {
      service.searchMeals('').subscribe((meals) => {
        expect(meals).toEqual([]);
        done();
      });
    });

    it('should return empty array when API returns null meals', (done) => {
      const mockResponse: MealSearchResponse = { meals: null };

      service.searchMeals('xyz').subscribe((meals) => {
        expect(meals).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/search.php?s=xyz`);
      req.flush(mockResponse);
    });

    it('should handle error gracefully', (done) => {
      service.searchMeals('test').subscribe((meals) => {
        expect(meals).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/search.php?s=test`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('extractIngredients', () => {
    it('should extract ingredients and measures from meal', () => {
      const meal: Partial<Meal> = {
        strIngredient1: 'Chicken',
        strMeasure1: '2 pieces',
        strIngredient2: 'Soy Sauce',
        strMeasure2: '1/4 cup',
        strIngredient3: '',
        strMeasure3: '',
      } as Meal;

      const ingredients = service.extractIngredients(meal as Meal);

      expect(ingredients.length).toBe(2);
      expect(ingredients[0]).toEqual({ name: 'Chicken', measure: '2 pieces' });
      expect(ingredients[1]).toEqual({ name: 'Soy Sauce', measure: '1/4 cup' });
    });

    it('should handle missing measures', () => {
      const meal: Partial<Meal> = {
        strIngredient1: 'Salt',
        strMeasure1: null,
        strIngredient2: 'Pepper',
        strMeasure2: undefined,
      } as any;

      const ingredients = service.extractIngredients(meal as Meal);

      expect(ingredients.length).toBe(2);
      expect(ingredients[0]).toEqual({ name: 'Salt', measure: '' });
      expect(ingredients[1]).toEqual({ name: 'Pepper', measure: '' });
    });
  });
});
