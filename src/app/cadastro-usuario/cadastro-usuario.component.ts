import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '../usuario.service';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css']
})
export class CadastroUsuarioComponent {
  usuarioForm: FormGroup;
  displayedColumns: string[] = ['id', 'login', 'perfil', 'ativo', 'acoes'];


usuarios = new MatTableDataSource<any>();
menuSections: any;
userName: string | null = '';
userProfile: string | null = '';
  router: any;
  isAuthenticated: boolean | undefined;


  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) {
    this.usuarioForm = this.fb.group({
      id: [null], // Campo para identificar se é edição
      login: ['', [Validators.required, Validators.maxLength(50)]],
      senha: ['', [Validators.required, Validators.maxLength(20)]],
      perfil: ['', Validators.required],
      ativo: [1]
    });

    // Carrega os usuários ao inicializar
    this.loadUsuarios();
  }

  
// Método para carregar usuários
loadUsuarios(): void {
  this.usuarioService.getUsuarios().subscribe(
    (data: any[]) => {
      this.usuarios.data = data;
    },
    () => {
      this.snackBar.open('Erro ao carregar usuários.', 'Fechar', {
        duration: 3000,
      });
    }
  );
}

onEdit(usuario: any): void {
  // Popula o formulário com os dados do usuário selecionado
  this.usuarioForm.patchValue({
    id: usuario.id, // Preenche o campo id
    login: usuario.login,
    senha: usuario.senha,
    perfil: usuario.perfil,
    ativo: usuario.ativo
  });

  this.snackBar.open(`Edite os dados do usuário ${usuario.login}.`, 'Fechar', {
    duration: 3000,
  });
}


onRegister(): void {
  if (this.usuarioForm.valid) {
    const usuarioData = this.usuarioForm.value;

    if (usuarioData.id) {
      // Atualizar o usuário existente
      this.usuarioService.updateUsuario(usuarioData).subscribe(
        () => {
          this.snackBar.open('Usuário atualizado com sucesso!', 'Fechar', {
            duration: 3000,
          });
          this.usuarioForm.reset({ ativo: 1 });
          this.loadUsuarios();
        },
        () => {
          this.snackBar.open('Erro ao atualizar o usuário.', 'Fechar', {
            duration: 3000,
          });
        }
      );
    } else {
      // Criar um novo usuário
      this.usuarioService.createUsuario(usuarioData).subscribe(
        () => {
          this.snackBar.open('Usuário cadastrado com sucesso!', 'Fechar', {
            duration: 3000,
          });
          this.usuarioForm.reset({ ativo: 1 });
          this.loadUsuarios();
        },
        () => {
          this.snackBar.open('Erro ao cadastrar o usuário.', 'Fechar', {
            duration: 3000,
          });
        }
      );
    }
  }
}

  onInativar(usuario: any): void {
    if (confirm(`Deseja realmente inativar o usuário ${usuario.login}?`)) {
      // Atualize o status do usuário para inativo
      const usuarioAtualizado = { ...usuario, ativo: 0 };
  
      this.usuarioService.createUsuario(usuarioAtualizado).subscribe(
        () => {
          this.snackBar.open(`Usuário ${usuario.login} inativado com sucesso.`, 'Fechar', {
            duration: 3000,
          });
          this.loadUsuarios(); // Atualiza a tabela após a inativação
        },
        () => {
          this.snackBar.open('Erro ao inativar o usuário.', 'Fechar', {
            duration: 3000,
          });
        }
      );
    }
  }
  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const authToken = localStorage.getItem('authToken');
        this.isAuthenticated = !!authToken;
  
        if (this.isAuthenticated) {
          this.userProfile = localStorage.getItem('userProfile'); // Recupere o perfil do usuário
        } else {
          this.router.navigate(['/login']);
        }
  
        this.userName = localStorage.getItem('userName') || 'Usuário';
      }
    });
  }
  }

