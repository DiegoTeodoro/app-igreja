import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroEmpresaComponent } from './cadastro-empresa/cadastro-empresa.component';

const routes: Routes = [
  { path: 'empresa', component: CadastroEmpresaComponent },
  { path: '', redirectTo: '/empresa', pathMatch: 'full' } // Redireciona para 'empresa' como padrão
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
