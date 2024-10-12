import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Importando o componente Home
import { CadastroEmpresaComponent } from './cadastro-empresa/cadastro-empresa.component';
import { CadastroSetorComponent } from './cadastro-setor/cadastro-setor.component';
import { CadastroEstadosComponent } from './cadastro-estados/cadastro-estados.component';
import { CadastroCidadesComponent } from './cadastro-cidades/cadastro-cidades.component';
import { CadastroIgrejaComponent } from './cadastro-igreja/cadastro-igreja.component';
import { CadastroCategoriaComponent } from './cadastro-categoria/cadastro-categoria.component';
import { CadastroProdutoComponent } from './cadastro-produto/cadastro-produto.component';
import { ConsultaProdutoComponent } from './consulta-produto/consulta-produto.component';



const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },  // Redireciona para Home por padrão
  { path: 'home', component: HomeComponent },            // Rota para a Home
  { path: 'empresa', component: CadastroEmpresaComponent },  // Rota para cadastro de empresa
  { path: 'setor', component: CadastroSetorComponent },
  { path:'estados', component: CadastroEstadosComponent},
  { path:'cidades', component: CadastroCidadesComponent},
  { path:'igreja', component: CadastroIgrejaComponent},
  { path:'categoria', component: CadastroCategoriaComponent},
  { path: 'produto', component: CadastroProdutoComponent},
  { path: 'consulta-produto', component: ConsultaProdutoComponent },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
