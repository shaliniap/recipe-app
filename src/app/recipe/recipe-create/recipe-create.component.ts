import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Recipe } from '../recipe.model';
import { Step } from '../step.model';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})
export class RecipeCreateComponent implements OnInit {
  private recipeId: string;
  private stepId: string;
  mode = 'create';
  recipe: Recipe;
  step: Step;
  recipeForm: FormGroup;
  imagePreview: string;
  show = false;
  recipeName: FormGroup;
  emailValue: string;

  constructor(private recipeService: RecipeService, public route: ActivatedRoute, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.recipeName = new FormGroup({
      name: new FormControl(null, [Validators.required])
    });

    this.recipeForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      image: new FormControl(null, [Validators.required]),
      videoLink: new FormControl(null),
      timer: new FormControl(null, [Validators.pattern('[0-9]+(\.[0-9]?){0,2}')])
    });

    // The form field values are pre-filled if the mode is to edit recipe or step
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('recipeId')) {
        this.mode = 'editRecipe';
        this.recipeId = paramMap.get('recipeId');
        this.recipeService.getRecipe(this.recipeId).subscribe(recipeData => {
          this.recipe = {
            id: recipeData._id,
            name: recipeData.name
          };
          this.recipeName.setValue({
            name: this.recipe.name
          });
        });
      } else if (paramMap.has('stepId')) {
        this.mode = 'editStep';
        this.show = true;
        this.stepId = paramMap.get('stepId');
        console.log(this.stepId);
        this.recipeService.getStep(this.stepId).subscribe(stepData => {
          this.step = {
            stepId: stepData._id,
            recipeId: stepData.recipeId,
            title: stepData.title,
            description: stepData.description,
            imagePath: stepData.imagePath,
            videoLink: stepData.videoLink,
            timer: stepData.timer
          };
          this.recipeForm.setValue({
            title: this.step.title,
            description: this.step.description,
            image: this.step.imagePath,
            videoLink: this.step.videoLink,
            timer: this.step.timer
          });
        });
      } else {
        this.mode = 'create';
        this.recipeId = null;
      }
    });
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.recipeForm.patchValue({image: file});
    this.recipeForm.get('image').updateValueAndValidity(); // updates if the image is re-selected

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onAddRecipe() {
    if (this.recipeName.invalid) {
      return;
    }

    if (this.mode === 'create') {
      this.recipeService.addRecipe(this.recipeName.value.name).subscribe(res => {
        this.recipeId = res.recipe.id;
        this.snackbar.open('Message', res['message'], {
          duration: 2000
        });
      });
    } else if (this.mode === 'editRecipe') {
      this.recipeService.updateRecipe(this.recipeId, this.recipeName.value.name);
    }

    console.log(this.recipeName.value.name);
    this.show = true;

    this.recipeName.disable(); // disable adding new recipes, when recipe steps are added

  }

  onAddStep() {
    if (this.recipeForm.invalid) {
      return;
    }
    if (this.mode === 'editStep') {
      console.log(this.step);
      this.recipeService.updateStep(this.stepId, this.step.recipeId, this.recipeForm.value.title, this.recipeForm.value.description,
                                    this.recipeForm.value.image, this.recipeForm.value.videoLink, this.recipeForm.value.timer);
    } else {
      this.recipeService.addRecipeStep(this.recipeId, this.recipeForm.value.title, this.recipeForm.value.description,
                   this.recipeForm.value.image, this.recipeForm.value.videoLink, this.recipeForm.value.timer)
                  .subscribe(res => {
                    this.snackbar.open('Message', res['message'], {
                      duration: 2000
                    });
                  });

    }

    this.recipeForm.reset();
  }

}
