import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material';
import { Recipe } from '../recipe.model';
import { Step } from '../step.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Recipe[] = [];
  steps: Step[] = [];
  private recipeSub: Subscription;
  recipeList = [];

  initialValue = '';
  private timerSubscription: Subscription;

  constructor(private recipeService: RecipeService, private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.recipeService.getRecipes();

    // subscribe to changes when recipes, steps are added/updated/deleted
    this.recipeSub = this.recipeService.getRecipeUpdateListener().subscribe(
      (recipeData: {recipes: Recipe[], steps: Step[], recipeCount: number, recipeList: any}) => {
        console.log(recipeData.recipes);
        console.log(recipeData.steps);
        this.steps = recipeData.steps;
        this.recipes = recipeData.recipes;
        this.recipeList = recipeData.recipeList;
        console.log(this.recipeList);

      }
    );

  }

  // deleted recipe and all the related steps
  onDelete(recipeId: string) {
    console.log(recipeId);
    this.recipeService.deleteRecipe(recipeId).subscribe(() => {
      this.recipeService.getRecipes();
    });
  }

  // deletes one step of the recipe
  onDeleteStep(stepId: string) {
    console.log(stepId);
    this.recipeService.deleteStep(stepId).subscribe(() => {
      this.recipeService.getRecipes();
    });
  }

  // timer countdown
  startTimer(time) {
    const timeInSeconds = time * 60;
    this.initialValue = this.formatTime(timeInSeconds);
    this.changeDetector.detectChanges();

    const timeDiff: Observable<number> = interval(1000);
    this.timerSubscription = timeDiff.pipe(take(timeInSeconds)).pipe(map(c => timeInSeconds - (c + 1))).subscribe(v => {
      this.initialValue = this.formatTime(v);
      this.changeDetector.detectChanges();
    }, err => {
      console.log(err);
    }, () => {
      this.timerSubscription.unsubscribe();
      this.initialValue = '00:00';
      this.changeDetector.detectChanges();
    });

  }

  // format the time
  private formatTime(min) {
    const minutes = Math.floor(min / 60);
    const formattedMinutes = '' + (minutes > 9 ? minutes : '0' + minutes);
    const seconds = min % 60;
    const formattedSeconds = '' + (seconds > 9 ? seconds : '0' + seconds);
    return `${formattedMinutes}:${formattedSeconds}`;
    }

  // unsubscribe to recipe list changes
  ngOnDestroy() {
    this.recipeSub.unsubscribe();
  }
}
