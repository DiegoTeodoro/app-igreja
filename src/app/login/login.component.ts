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

  onLogin(): void {
    if (this.loginForm.valid) {
      const { login, senha } = this.loginForm.value;
      this.usuarioService.login({ login, senha }).subscribe(
        (response) => {
          // Suponha que response.token seja o token retornado
          localStorage.setItem('authToken', response.token); // Salva o token
          localStorage.setItem('userName', response.usuario.nome); // Salva o nome do usuário (opcional)
          this.router.navigate(['/home']); // Redireciona para a página inicial
        },
        (error) => {
          console.error('Erro ao autenticar:', error);
          alert('Usuário ou senha inválidos!');
        }
      );
    }
  }
  
  
  }
  
  
  
  

