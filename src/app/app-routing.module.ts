import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Importando o componente Home
import { CadastroEmpresaComponent } from './cadastro-empresa/cadastro-empresa.component';
import { CadastroSetorComponent } from './cadastro-setor/cadastro-setor.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },  // Redireciona para Home por padrão
  { path: 'home', component: HomeComponent },            // Rota para a Home
  { path: 'empresa', component: CadastroEmpresaComponent },  // Rota para cadastro de empresa
  { path: 'setor', component: CadastroSetorComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
