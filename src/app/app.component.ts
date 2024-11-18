import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  pageTitle = 'CCLIMP';
  isSidenavOpen = true;
  isAuthenticated = false;
  userName: string | null = '';

  homeLink = { title: 'Home', route: '/home' };
  
  menuSections = [
    {
      title: 'Cadastros',
      links: [
        { title: 'Empresa', route: '/empresa' },
        { title: 'Setor', route: '/setor' },
        { title: 'Estados', route: '/estados' },
        { title: 'Cidades', route: '/cidades' },
        { title: 'Igreja', route: '/igreja', icon: 'assets/igreja.svg' },
        { title: 'Categorias', route: '/categoria' },
        { title: 'Inventario', route: '/inventario' },
        { title: 'Usuario', route: '/cadastro-usuario' },
        { title: 'Login', route: '/login' },
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
        { title: 'Consulta nota', route: '/consulta-nota-fiscal' },
      ]
    },
    {
      title: 'Pedidos',
      links: [
        { title: 'Cadastro pedidos', route: '/cadastro-pedido' },
        { title: 'Consulta pedidos', route: '/consulta-pedido' }
      ]
    },
    {
      title: 'Relatorios',
      links: [
        { title: 'Saldo estoque', route: '/saldo-estoque' },
        { title: 'Pedidos', route: '/relatorio-pedidos' },
        { title: 'Produtos', route: '/relatorio-produto' }
      ]
    }
  ];
sidenav: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isAuthenticated = !this.router.url.includes('login');
        this.isSidenavOpen = this.isAuthenticated;
  
        // Recupera o nome do usuário do localStorage
        this.userName = localStorage.getItem('userName') || 'Usuário';
      }
    });
  }
  
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName'); // Remove o nome do usuário ao sair
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }
}
