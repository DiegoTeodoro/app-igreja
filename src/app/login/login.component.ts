import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../usuario.service'; // Ajuste o caminho conforme necessário

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // Use "!" para indicar que ele será inicializado na ngOnInit
  hidePassword = true;

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
          localStorage.setItem('authToken', response.token); // Salva o token
          localStorage.setItem('userName', response.usuario.nome); // Salva o nome do usuário (opcional)
          localStorage.setItem('userProfile', response.usuario.perfil.toLowerCase()); // Salva o perfil do usuário em letras minúsculas
          this.router.navigate(['/home']); // Redireciona para a página inicial
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
