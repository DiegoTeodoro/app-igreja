import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CadastroEmpresaComponent } from './cadastros/cadastro-empresa/cadastro-empresa.component';
import { MatCardModule }  from '@angular/material/card';
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
import { CadastroSetorComponent } from './cadastros/cadastro-setor/cadastro-setor.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CadastroEstadosComponent } from './cadastros/cadastro-estados/cadastro-estados.component';
import { CadastroCidadesComponent } from './cadastros/cadastro-cidades/cadastro-cidades.component';
import { CadastroIgrejaComponent } from './cadastros/cadastro-igreja/cadastro-igreja.component'; 
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { CadastroCategoriaComponent } from './cadastros/cadastro-categoria/cadastro-categoria.component';
import { DeleteDialogComponent } from './cadastros/cadastro-categoria/delete-dialog.component';
import { CadastroProdutoComponent } from './cadastros/cadastro-produto/cadastro-produto.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CadastroNotaFiscalComponent } from './cadastros/cadastro-nota-fiscal/cadastro-nota-fiscal.component';
import { CadastroPedidoComponent } from './cadastros/cadastro-pedido/cadastro-pedido.component';
import { RouterModule } from '@angular/router';
import { CadastroUsuarioComponent } from './cadastros/cadastro-usuario/cadastro-usuario.component';
import { RelatorioSaldoEstoqueComponent } from './relatorios/relatorio-saldo-estoque/relatorio-saldo-estoque.component';
import { RelatorioPedidosComponent } from './relatorios/relatorio-pedidos/relatorio-pedidos.component';
import { RelatorioProdutoComponent } from './relatorios/relatorio-produto/relatorio-produto.component';
import { LoginComponent } from './login/login.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { CadastroInventarioComponent } from './cadastros/cadastro-inventario/cadastro-inventario.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RelatorioNotaFiscalComponent } from './relatorios/relatorio-nota-fiscal/relatorio-nota-fiscal.component';
import { RelatorioDetalhadoPedidosComponent } from './relatorios/relatorio-detalhado-pedidos/relatorio-detalhado-pedidos.component';
import { PedidoCompraComponent } from './cadastros/pedido-compra/pedido-compra.component';
import { RelatorioPedidoCompraComponent } from './relatorios/relatorio-pedido-compra/relatorio-pedido-compra.component';
import { ConsultaPedidoComponent } from './consultas/consulta-pedido/consulta-pedido.component';
import { RelatorioInventarioComponent } from './relatorios/relatorio-inventario/relatorio-inventario.component';
import { CadastroFornecedorComponent } from './cadastros/cadastro-fornecedor/cadastro-fornecedor.component';
import { ConsultaFornecedorComponent } from './consultas/consulta-fornecedor/consulta-fornecedor.component';
import { RelatorioFornecedorComponent } from './relatorios/relatorio-fornecedor/relatorio-fornecedor.component';
import { ConsultaNotaFiscalComponent } from './consultas/consulta-nota-fiscal/consulta-nota-fiscal.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ConsultaIgrejaComponent } from './consultas/consulta-igreja/consulta-igreja.component';
import { MatSortModule } from '@angular/material/sort';
import { ConfirmDialog, ConsultaProdutoComponent } from './consultas/consulta-produto/consulta-produto.component';

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
    CadastroNotaFiscalComponent,
    CadastroPedidoComponent,
    CadastroUsuarioComponent,
    RelatorioSaldoEstoqueComponent,
    RelatorioPedidosComponent,
    RelatorioProdutoComponent,
    LoginComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    CadastroInventarioComponent,
    RelatorioNotaFiscalComponent,
    RelatorioDetalhadoPedidosComponent,
    PedidoCompraComponent,
    RelatorioPedidoCompraComponent,
    ConsultaPedidoComponent,
    RelatorioInventarioComponent,
    CadastroFornecedorComponent,
    ConsultaFornecedorComponent,
    RelatorioFornecedorComponent,
    ConsultaNotaFiscalComponent,
    ConsultaIgrejaComponent,
    ConsultaProdutoComponent,
    ConfirmDialog,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule,
    MatSnackBarModule,
    MatRadioModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatTableModule,        // ✅ Agora está certo
    NgxMaskDirective,
    NgxMaskPipe,
    MatSortModule,
    
  ],
  
  providers: [
    provideNgxMask(),
    { provide: LOCALE_ID, useValue: 'pt-BR' },  // Configuração do locale
   
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      'sair',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/sair.svg')
    );
  }
}
