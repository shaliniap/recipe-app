import { Recipe } from './recipe.model';
import { Step } from './step.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({providedIn : 'root'})
export class RecipeService {
  private recipes: Recipe[] = [];
  private steps: Step[] = [];
  recipeList = [];
  private recipesUpdated = new Subject<{recipes: Recipe[], steps: Step[], recipeCount: number, recipeList: any}>();
  constructor(private http: HttpClient, private router: Router, private snackbar: MatSnackBar){}


  // create new recipe
  addRecipe(name: string) {
    const recipe: Recipe = {id: null, name};
    return this.http.post<{message: string, recipe: Recipe}>(
      'http://localhost:3000/api/recipes', recipe
      )
      .pipe(map(res => {
        return res;
      }));
  }

  // create new step for recipe
  addRecipeStep(id: string, title: string, description: string, image: File, videoLink: string, timer: number) {
    const recipeData = new FormData();
    recipeData.append('recipeId', id);
    recipeData.append('title', title);
    recipeData.append('description', description);
    recipeData.append('image', image, title);
    recipeData.append('videoLink', videoLink);
    recipeData.append('timer', timer.toString());
    return this.http.post<{message: string, post: Step}>(
      'http://localhost:3000/api/recipes/step', recipeData
      )
      .pipe(map(res => {
        return res;
      }));
  }

  // get the list of recipes and steps. Both are stored as different collection
  getRecipes() {
    this.http.get<{ message: string, recipes: any, steps: any, recipeCount: number}>('http://localhost:3000/api/recipes/recipeList')
     .pipe(map((recipeData) => {
      console.log(recipeData);
      this.recipeList = [];
      recipeData.recipes.forEach(recipe => {
       const jsonRecipe = {};
       jsonRecipe['rId'] = recipe._id;
       jsonRecipe['rName'] = recipe.name;
       const rSteps = recipeData.steps.filter(step => step.recipeId === recipe._id);
       console.log(rSteps);
       jsonRecipe['rSteps'] = rSteps;
       console.log(jsonRecipe);
       this.recipeList.push(jsonRecipe);
       console.log(this.recipeList);
      });
      return {
        recipes: recipeData.recipes.map(recipe => {
         return {
           id: recipe._id,
           name: recipe.name
         };
       }),
       steps: recipeData.steps.map(step => {
         return {
          stepId: step._id,
          recipeId: step.recipeId,
          title: step.title,
          description: step.description,
          imagePath: step.imagePath,
          videoLink: step.videoLink,
          timer: step.timer
         };
       }),
       recipeCount: recipeData.recipeCount,
       recipeList: this.recipeList
     };
    }))
     .subscribe(transformedRecipeData => {   // stores the updated recipes/steps
       this.recipes = transformedRecipeData.recipes;
       this.steps = transformedRecipeData.steps;
       this.recipeList = transformedRecipeData.recipeList;
       this.recipesUpdated.next({
         recipes: [...this.recipes],
         steps: [...this.steps],
         recipeCount: transformedRecipeData.recipeCount,
         recipeList: this.recipeList
        });
     });
  }

  // change recipe name
  updateRecipe(id: string, name: string) {
   let recipeData: Recipe | FormData;
   recipeData = { id, name};
   this.http.put('http://localhost:3000/api/recipes/updateRecipe/' + id, recipeData);
  }

  // change the step form fields
  updateStep(stepId: string, recipeId: string, title: string, description: string, imagePath: string, videoLink: string, timer: number) {
    let stepData: Step | FormData;
    stepData = { stepId, recipeId, title, description, imagePath, videoLink, timer};
    this.http.put('http://localhost:3000/api/recipes/updateStep/' + stepId, stepData)
              .subscribe(res => {
               this.router.navigate(['/']);
              });
   }

  getRecipeUpdateListener() {
    return this.recipesUpdated.asObservable();   // returns the updated recipes/steps
  }

  // get details of a recipe, clicked to edit
  getRecipe(id: string) {
    return this.http.get<{_id: string, name: string}>('http://localhost:3000/api/recipes/recipe/' + id);
  }

  // get details of the step, clicked to edit
  getStep(id: string) {
    return this.http
    .get<{_id: string,
      recipeId: string,
      title: string,
      description: string,
      imagePath: string,
      videoLink: string,
      timer: number}>('http://localhost:3000/api/recipes/step/' + id);
  }

  // pass the recipe Id to be deleted, along with http request
  deleteRecipe(recipeId: string) {
    console.log(recipeId);
    return this.http.delete('http://localhost:3000/api/recipes/recipe/' + recipeId);
  }

  // pass the step Id to be deleted, along with http request
  deleteStep(stepId: string) {
    return this.http.delete('http://localhost:3000/api/recipes/step/' + stepId);
  }
}
