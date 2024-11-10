import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css']
})
export class CadastroUsuarioComponent {
  userForm: FormGroup; // Ensure it's not marked as possibly undefined

  constructor(private fb: FormBuilder) {
    // Create the form group using FormBuilder
    this.userForm = this.fb.group({
      login: ['', [Validators.required]],
      senha: ['', [Validators.required]],
      perfil: [null, [Validators.required]], // Valor padrão como null para não selecionar automaticamente
      ativo: [1, [Validators.required]] // Valor padrão como 1 para o radio button "Ativo"
    });
    
  }    

  onRegister() {
    if (this.userForm.valid) {
      console.log('User form data:', this.userForm.value);
      // Your form submission logic here
    } else {
      console.log('Form is invalid');
    }
  }
}
