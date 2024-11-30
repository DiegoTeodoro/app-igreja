import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CadastroEmpresaComponent } from './cadastro-empresa/cadastro-empresa.component';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CadastroNotaFiscalComponent } from './cadastro-nota-fiscal/cadastro-nota-fiscal.component';
import { CadastroPedidoComponent } from './cadastro-pedido/cadastro-pedido.component';
import { RouterModule } from '@angular/router';
import { ConsultaNotaFiscalComponent } from './consulta-nota-fiscal/consulta-nota-fiscal.component';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';
import { RelatorioSaldoEstoqueComponent } from './relatorio-saldo-estoque/relatorio-saldo-estoque.component';
import { RelatorioPedidosComponent } from './relatorio-pedidos/relatorio-pedidos.component';
import { ConsultaPedidoComponent } from './consulta-pedido/consulta-pedido.component';
import { RelatorioProdutoComponent } from './relatorio-produto/relatorio-produto.component';
import { LoginComponent } from './login/login.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { CadastroInventarioComponent } from './cadastro-inventario/cadastro-inventario.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgChartsModule } from 'ng2-charts';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RelatorioNotaFiscalComponent } from './relatorio-nota-fiscal/relatorio-nota-fiscal.component';




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
    CadastroPedidoComponent,
    ConsultaNotaFiscalComponent,
    CadastroUsuarioComponent,
    RelatorioSaldoEstoqueComponent,
    RelatorioPedidosComponent,
    ConsultaPedidoComponent,
    RelatorioProdutoComponent,
    LoginComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    CadastroInventarioComponent,
    DashboardComponent,
    RelatorioNotaFiscalComponent,
  


   
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
    MatNativeDateModule,
    MatPaginatorModule,
    MatTableModule,
    RouterModule,
    MatSidenavModule,
    NgChartsModule, // Adicione esta linha
    
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }  // Configuração do locale
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
