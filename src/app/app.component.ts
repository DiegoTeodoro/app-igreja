import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  pageTitle = 'CNS LIMPEZA';
  isSidenavOpen = true;
  isAuthenticated = false;
  userName: string | null = '';
  userProfile: string | null = ''; // Variável para armazenar o perfil do usuário

  homeLink = { title: 'Home', route: '/home', icon: 'home' };
  
  menuSections = [
    {
      title: 'Cadastros',
      links: [
        { title: 'Empresa', route: '/empresa', icon: 'business' },
        { title: 'Setor', route: '/setor', icon: 'domain' },
        { title: 'Estados', route: '/estados', icon: 'public' },
        { title: 'Cidades', route: '/cidades', icon: 'location_city' },
        { title: 'Igreja', route: '/igreja', icon: 'church' },
        { title: 'Categorias', route: '/categoria', icon: 'category' },
        { title: 'Inventario', route: '/cadastro-inventario', icon: 'inventory' },
        { title: 'Usuario', route: '/cadastro-usuario', icon: 'person' },
        { title: 'Login', route: '/login', icon: 'login' },
      ]
    },
    {
      title: 'Produtos',
      links: [
        { title: 'Cadastro', route: '/produto', icon: 'shopping_cart' },
      ]
    },
    {
      title: 'Notas Fiscais',
      links: [
        { title: 'Entrada de Nota', route: '/cadastro-nota-fiscal', icon: 'receipt' },
        { title: 'Consulta nota', route: '/consulta-nota-fiscal', icon: 'search' },
      ]
    },
    {
      title: 'Pedidos',
      links: [
        { title: 'Cadastro pedidos', route: '/cadastro-pedido', icon: 'assignment' },
        { title: 'Consulta pedidos', route: '/consulta-pedido', icon: 'list_alt' }
      ]
    },
    {
      title: 'Relatorios',
      links: [
        { title: 'Saldo estoque', route: '/saldo-estoque', icon: 'bar_chart' },
        { title: 'Pedidos', route: '/relatorio-pedidos', icon: 'assignment_turned_in' },
        { title: 'Produtos', route: '/relatorio-produto', icon: 'inventory_2' }
      ]
    },
    {
      title: 'dashboard',
      links: [
        { title: 'Dashboard', route: '/dashboard', icon: 'bar_chart' }
      ]
    }
  ];
  sidenav: any;

  // @HostListener('window:beforeunload', ['$event'])
  // onBeforeUnload(event: Event): void {
  //   localStorage.removeItem('authToken');
  //   localStorage.removeItem('userName');
  // }

  constructor(private router: Router, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      'assignment',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/assignment.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'assignment_turned_in',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/assignment_turned_in.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'bar_chart',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/bar_chart.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'business',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/business.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'category',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/category.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'church',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/church.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'domain',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/domain.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'public',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/public.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'home',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/home.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'inventory',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/inventory.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'inventory_2',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/inventory_2.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'list_alt',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/list_alt.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'login',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/login.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'person',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/person.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'receipt',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/receipt.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'search',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/search.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'shopping_cart',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/shopping_cart.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'location_city',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/location_city.svg')
    );
  }

  isLoginRoute(): boolean {
    return this.router.url === '/login';
  }
  

  ngOnInit(): void {
    this.checkAuthentication();
  
    // Monitora mudanças de rota para atualizar a autenticação
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkAuthentication();
      }
    });
  
    // Gerencia múltiplas abas
    const openTabs = parseInt(sessionStorage.getItem('openTabs') || '0', 10);
    sessionStorage.setItem('openTabs', (openTabs + 1).toString());
  
    window.addEventListener('beforeunload', () => {
      const currentTabs = parseInt(sessionStorage.getItem('openTabs') || '1', 10);
      if (currentTabs > 1) {
        sessionStorage.setItem('openTabs', (currentTabs - 1).toString());
      } else {
        sessionStorage.clear(); // Limpa apenas o sessionStorage
      }
    });
  }
  

  checkAuthentication(): void {
    const authToken = localStorage.getItem('authToken');
    this.isAuthenticated = !!authToken;

    if (this.isAuthenticated) {
      this.userName = localStorage.getItem('userName') || 'Usuário';
      this.userProfile = localStorage.getItem('userProfile') || '';
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }
}