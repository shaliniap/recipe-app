import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatDialogModule,
        MatSnackBarModule} from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecipeCreateComponent } from './recipe/recipe-create/recipe-create.component';
import { HttpClientModule } from '@angular/common/http';
import { RecipeListComponent } from './recipe/recipe-list/recipe-list.component';
import { HeaderComponent } from './header/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    RecipeCreateComponent,
    RecipeListComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
