import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('authToken');
    const userProfile = localStorage.getItem('userProfile');
  
    if (token) {
      // Converte o perfil do usuário para letras minúsculas para garantir a comparação correta
      if (route.url[0].path === 'cadastro-usuario' && userProfile?.toLowerCase() !== 'administrador') {
        alert('Acesso negado!');
        this.router.navigate(['/home']); // Redireciona para a tela inicial
        return false;
      }
      return true;
    } else {
      // Redireciona para login se não autenticado
      this.router.navigate(['/login']);
      return false;
    }
  }
}

