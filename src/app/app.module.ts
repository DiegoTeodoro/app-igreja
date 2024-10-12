import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CadastroEmpresaComponent } from './cadastro-empresa/cadastro-empresa.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from './home/home.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { CadastroSetorComponent } from './cadastro-setor/cadastro-setor.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CadastroEstadosComponent } from './cadastro-estados/cadastro-estados.component';
import { CadastroCidadesComponent } from './cadastro-cidades/cadastro-cidades.component';
import { CadastroIgrejaComponent } from './cadastro-igreja/cadastro-igreja.component'; 
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { CadastroCategoriaComponent } from './cadastro-categoria/cadastro-categoria.component';
import { DeleteDialogComponent } from './cadastro-categoria/delete-dialog.component';
import { CadastroProdutoComponent } from './cadastro-produto/cadastro-produto.component';
import { ConfirmDialog, ConsultaProdutoComponent } from './consulta-produto/consulta-produto.component';
import { CadastroNotaFiscalComponent } from './cadastro-nota-fiscal/cadastro-nota-fiscal.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

// Registre o locale `pt-BR`
registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    CadastroEmpresaComponent,
    HomeComponent,
    CadastroSetorComponent,
    CadastroEstadosComponent,
    CadastroCidadesComponent,
    CadastroIgrejaComponent,
    CadastroCategoriaComponent,
    DeleteDialogComponent,
    CadastroProdutoComponent,
    ConsultaProdutoComponent,
    ConfirmDialog,
    CadastroNotaFiscalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    FormsModule,
    HttpClientModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule,
    MatSnackBarModule,
    MatRadioModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }  // Configuração do locale
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
