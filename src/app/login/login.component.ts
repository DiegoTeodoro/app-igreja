import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service'; // Ajuste o caminho conforme necessário

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // Use "!" para indicar que ele será inicializado na ngOnInit
  hidePassword = true;
  isAuthenticated: boolean | undefined;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required]],
      senha: ['', [Validators.required]]
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const { login, senha } = this.loginForm.value;
      this.usuarioService.login({ login, senha }).subscribe(
        (response) => {
          const loginTime = new Date().getTime(); // Obtém o timestamp atual
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('userId', response.usuario.id);
          localStorage.setItem('userName', response.usuario.nome);
          localStorage.setItem('userProfile', response.usuario.perfil.toLowerCase());
          localStorage.setItem('loginTime', loginTime.toString()); // Salva o horário do login
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Erro ao autenticar:', error);
          alert('Usuário ou senha inválidos!');
        }
      );
    }
  }  
  

  login(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
  
      this.usuarioService.login(credentials).subscribe(
        (response) => {
          if (response.authToken) {
            localStorage.setItem('authToken', response.authToken);
            localStorage.setItem('userName', response.userName);
            localStorage.setItem('userProfile', response.userProfile); // Salva o perfil do usuário
            this.router.navigate(['/home']);
          } else {
            alert('Login ou senha inválidos.');
          }
        },
        (error) => {
          console.error('Erro no login:', error);
          alert('Erro ao tentar logar. Verifique suas credenciais.');
        }
      );
    }
  }
  
}
