import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CadastroEmpresaComponent } from './cadastro-empresa/cadastro-empresa.component';
import { CadastroSetorComponent } from './cadastro-setor/cadastro-setor.component';
import { CadastroEstadosComponent } from './cadastro-estados/cadastro-estados.component';
import { CadastroCidadesComponent } from './cadastro-cidades/cadastro-cidades.component';
import { CadastroIgrejaComponent } from './cadastro-igreja/cadastro-igreja.component';
import { CadastroCategoriaComponent } from './cadastro-categoria/cadastro-categoria.component';
import { CadastroProdutoComponent } from './cadastro-produto/cadastro-produto.component';
import { ConsultaProdutoComponent } from './consulta-produto/consulta-produto.component';
import { CadastroNotaFiscalComponent } from './cadastro-nota-fiscal/cadastro-nota-fiscal.component';
import { CadastroPedidoComponent } from './cadastro-pedido/cadastro-pedido.component';
import { ConsultaNotaFiscalComponent } from './consulta-nota-fiscal/consulta-nota-fiscal.component';
import { RelatorioSaldoEstoqueComponent } from './relatorio-saldo-estoque/relatorio-saldo-estoque.component';
import { RelatorioPedidosComponent } from './relatorio-pedidos/relatorio-pedidos.component';
import { ConsultaPedidoComponent } from './consulta-pedido/consulta-pedido.component';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';
import { InventarioComponent } from './inventario/inventario.component';
import { RelatorioProdutoComponent } from './relatorio-produto/relatorio-produto.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'empresa', component: CadastroEmpresaComponent, canActivate: [AuthGuard] },
  { path: 'setor', component: CadastroSetorComponent, canActivate: [AuthGuard] },
  { path: 'estados', component: CadastroEstadosComponent, canActivate: [AuthGuard] },
  { path: 'cidades', component: CadastroCidadesComponent, canActivate: [AuthGuard] },
  { path: 'igreja', component: CadastroIgrejaComponent, canActivate: [AuthGuard] },
  { path: 'categoria', component: CadastroCategoriaComponent, canActivate: [AuthGuard] },
  { path: 'produto', component: CadastroProdutoComponent, canActivate: [AuthGuard] },
  { path: 'consulta-produto', component: ConsultaProdutoComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-produto/:id', component: CadastroProdutoComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-nota-fiscal', component: CadastroNotaFiscalComponent, canActivate: [AuthGuard] },
  { path: 'consulta-nota-fiscal', component: ConsultaNotaFiscalComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-pedido', component: CadastroPedidoComponent, canActivate: [AuthGuard] },
  { path: 'saldo-estoque', component: RelatorioSaldoEstoqueComponent, canActivate: [AuthGuard] },
  { path: 'relatorio-pedidos', component: RelatorioPedidosComponent, canActivate: [AuthGuard] },
  { path: 'consulta-pedido', component: ConsultaPedidoComponent, canActivate: [AuthGuard]},
  { path: 'cadastro-usuario', component: CadastroUsuarioComponent, canActivate: [AuthGuard]},
  { path: 'inventario', component: InventarioComponent, canActivate: [AuthGuard]},
  { path: 'relatorio-produto', component: RelatorioProdutoComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}