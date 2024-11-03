import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pageTitle = 'CCLIMP';
  isSidenavOpen = true;

  // Definir a Home separada da seção de Cadastros
  homeLink = { title: 'Home', route: '/home' };

  // Seção de Cadastros
  menuSections = [
    {
      title: 'Cadastros',
      links: [
        { title: 'Empresa', route: '/empresa' },
        { title: 'Setor', route: '/setor' },
        { title: 'Estados', route: '/estados' },
        { title: 'Cidades', route: '/cidades' },
        { title: 'Igreja', route: '/igreja' },
        { title: 'Categorias', route: '/categoria' },
      ]
    },
    {
      title: 'Produtos',
      links: [
        { title: 'Cadastro', route: '/produto' },
      ]
    },
    {
      title: 'Notas Fiscais',
      links: [
        { title: 'Entrada de Nota', route: '/cadastro-nota-fiscal' },
      ]
    },
    {
      title: 'Pedidos',
      links: [
        { title: 'Cadastro pedidos', route: '/cadastro-pedido' }
      ]
    }
  ];

  logout() {
    console.log('Sair do sistema');
    // Aqui você pode implementar a lógica de logout, como redirecionar para a tela de login
  }
}