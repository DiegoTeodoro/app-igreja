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
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';
import { RelatorioSaldoEstoqueComponent } from './relatorio-saldo-estoque/relatorio-saldo-estoque.component';
import { RelatorioPedidosComponent } from './relatorio-pedidos/relatorio-pedidos.component';
import { ConsultaPedidoComponent } from './consulta-pedido/consulta-pedido.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'empresa', component: CadastroEmpresaComponent },
  { path: 'setor', component: CadastroSetorComponent },
  { path: 'estados', component: CadastroEstadosComponent },
  { path: 'cidades', component: CadastroCidadesComponent },
  { path: 'igreja', component: CadastroIgrejaComponent },
  { path: 'categoria', component: CadastroCategoriaComponent },
  { path: 'produto', component: CadastroProdutoComponent },
  { path: 'consulta-produto', component: ConsultaProdutoComponent },
  { path: 'cadastro-produto/:id', component: CadastroProdutoComponent },
  { path: 'cadastro-nota-fiscal', component: CadastroNotaFiscalComponent },
  { path: 'consulta-nota-fiscal', component: ConsultaNotaFiscalComponent },
  { path: 'cadastro-pedido', component: CadastroPedidoComponent },
  { path: 'cadastro-usuario', component: CadastroUsuarioComponent },
  { path: 'saldo-estoque', component: RelatorioSaldoEstoqueComponent },
  { path: 'relatorio-pedidos', component: RelatorioPedidosComponent },
  { path: 'consulta-pedido', component: ConsultaPedidoComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}