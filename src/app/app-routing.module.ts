import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeCreateComponent } from './recipe/recipe-create/recipe-create.component';
import { RecipeListComponent } from './recipe/recipe-list/recipe-list.component';

const routes: Routes = [
  {path: '', component: RecipeListComponent},
  {path: 'recipes', component: RecipeListComponent},
  {path: 'create', component: RecipeCreateComponent},
  {path: 'recipe/edit/:recipeId', component: RecipeCreateComponent},
  {path: 'step/edit/:stepId', component: RecipeCreateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
