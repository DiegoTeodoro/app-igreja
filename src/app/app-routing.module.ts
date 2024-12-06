import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CadastroEmpresaComponent } from './cadastros/cadastro-empresa/cadastro-empresa.component';
import { CadastroSetorComponent } from './cadastros/cadastro-setor/cadastro-setor.component';
import { CadastroEstadosComponent } from './cadastros/cadastro-estados/cadastro-estados.component';
import { CadastroCidadesComponent } from './cadastros/cadastro-cidades/cadastro-cidades.component';
import { CadastroIgrejaComponent } from './cadastros/cadastro-igreja/cadastro-igreja.component';
import { CadastroCategoriaComponent } from './cadastros/cadastro-categoria/cadastro-categoria.component';
import { CadastroProdutoComponent } from './cadastros/cadastro-produto/cadastro-produto.component';
import { ConsultaProdutoComponent } from './consulta-produto/consulta-produto.component';
import { CadastroNotaFiscalComponent } from './cadastros/cadastro-nota-fiscal/cadastro-nota-fiscal.component';
import { CadastroPedidoComponent } from './cadastros/cadastro-pedido/cadastro-pedido.component';
import { ConsultaNotaFiscalComponent } from './consulta-nota-fiscal/consulta-nota-fiscal.component';
import { RelatorioSaldoEstoqueComponent } from './relatorios/relatorio-saldo-estoque/relatorio-saldo-estoque.component';
import { RelatorioPedidosComponent } from './relatorios/relatorio-pedidos/relatorio-pedidos.component';
import { ConsultaPedidoComponent } from './consulta-pedido/consulta-pedido.component';
import { CadastroUsuarioComponent } from './cadastros/cadastro-usuario/cadastro-usuario.component';
import { RelatorioProdutoComponent } from './relatorios/relatorio-produto/relatorio-produto.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { CadastroInventarioComponent } from './cadastros/cadastro-inventario/cadastro-inventario.component';
import { RelatorioNotaFiscalComponent } from './relatorios/relatorio-nota-fiscal/relatorio-nota-fiscal.component';
import { RelatorioDetalhadoPedidosComponent } from './relatorios/relatorio-detalhado-pedidos/relatorio-detalhado-pedidos.component';
import { PedidoCompraComponent } from './cadastros/pedido-compra/pedido-compra.component';
import { RelatorioPedidoCompraComponent } from './relatorios/relatorio-pedido-compra/relatorio-pedido-compra.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
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
  { path: 'relatorio-produto', component: RelatorioProdutoComponent, canActivate: [AuthGuard]},
  { path: 'cadastro-inventario', component: CadastroInventarioComponent, canActivate: [AuthGuard]},
  { path: 'relatorio-nota-fiscal', component: RelatorioNotaFiscalComponent },
  { path: 'relatorio-detalhado-pedidos', component: RelatorioDetalhadoPedidosComponent },
  { path: 'pedido-compra', component: PedidoCompraComponent },
  { path: 'relatorio-pedido-compra', component: RelatorioPedidoCompraComponent },




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}