import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '../usuario.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css']
})
export class CadastroUsuarioComponent {
  usuarioForm: FormGroup;
  displayedColumns: string[] = ['id', 'login', 'senha', 'perfil', 'ativo'];

  usuarios = new MatTableDataSource<any>();

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) {
    this.usuarioForm = this.fb.group({
      login: ['', [Validators.required, Validators.maxLength(50)]],
      senha: ['', [Validators.required, Validators.maxLength(20)]],
      perfil: ['', Validators.required],
      ativo: [1]
    });

    // Carrega os usuários ao inicializar
    this.loadUsuarios();
  }

  onRegister(): void {
    if (this.usuarioForm.valid) {
      this.usuarioService.createUsuario(this.usuarioForm.value).subscribe(
        () => {
          this.snackBar.open('Usuário cadastrado com sucesso!', 'Fechar', {
            duration: 3000,
          });
          this.usuarioForm.reset({ ativo: 1 });
          this.loadUsuarios(); // Recarrega os usuários após o cadastro
        },
        () => {
          this.snackBar.open('Erro ao cadastrar o usuário.', 'Fechar', {
            duration: 3000,
          });
        }
      );
    }
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
}
