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
        { title: 'Empresa', route: '/empresa' },  // Rota para cadastro de empresa
        { title: 'Setor', route: '/setor' },
        { title:'Estados', route: '/estados'},
        { title:'Cidades', route: '/cidades'},
        { title:'Igreja', route: '/igreja'},
        { title:'Caterorias', route: '/categoria'},
        { title:'Produtos', route: '/produto'},
     
      ]
    }
  ];
}
