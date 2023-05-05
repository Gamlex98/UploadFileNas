import { Component } from '@angular/core';
import { AuthenticationService } from './upload-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AuthenticationComponent {

  fileToUpload !: File ;
  authenticated = false;
  sid = '';
  porcentaje: number = 0;
  enviando: boolean = false;
  overwrite= false;

  // listaArchivos: DocumentModel [] = [];

  constructor(private authService: AuthenticationService,private http: HttpClient) {}

  authenticate() {

    const usuario = 'Intranet';
    const pass = 'MW50cjQxMjMrLSo=';

    this.authService.authenticate(usuario, pass).subscribe(
      authSid => {
        this.authenticated = true;
        this.sid = authSid;
        console.log("SID generado: " + this.sid);
      },
      error => {
        console.error('Authentication failed', error);
      }
    );
  }

  onFileSelected(event: any) {
    this.fileToUpload = event.target.files[0];
  }

  onUpload() {
    const uploadUrl =`http://172.16.1.24:8095/cgi-bin/filemanager/utilRequest.cgi?func=upload&type=standard&sid=${this.sid}&dest_path=/Intranet/prueba&overwrite=1&progress=-Intranet`;
  
    if (!this.fileToUpload) {
      alert("Debes seleccionar un archivo");
      console.log("No seleccionó archivo");
      return;
    }
      // Obtener la lista de archivos
      this.authService.getList(this.sid).subscribe(
        async (data) => {
          console.log(data);  
          const existingFile = data.find((file: { filename: string; }) => file.filename.toLowerCase() === this.fileToUpload.name.toLowerCase());
          if (existingFile) {
            const result = await Swal.fire({
              title: 'El archivo ya existe. ¿Qué deseas hacer?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Sobrescribir',
              cancelButtonText: 'Cambiar nombre',
            });
          if (result.isConfirmed) {
              this.uploadFile(uploadUrl);
            } else if (result.dismiss == Swal.DismissReason.cancel) {
              // Permitir al usuario cambiar el nombre del archivo
              const newName = prompt("Por favor ingrese un nuevo nombre para el archivo:");
              const extensionIndex = this.fileToUpload.name.lastIndexOf('.');
              const extension = this.fileToUpload.name.substring(extensionIndex);
              const newFilename = `${newName}${extension}`;
              if (newFilename) {
                const newFile =  new File([this.fileToUpload], newFilename, { type: this.fileToUpload.type });
                this.fileToUpload = newFile;
                this.onUpload();
              } else {
                alert("Debe ingresar un nombre válido para el archivo.");
              }
            }
          } else {
            this.uploadFile(uploadUrl);
          }
        },
        (error) => {
          console.error("Error al obtener la lista de archivos", error);
        }
      );
  }

  uploadFile(uploadUrl: string) {
    const formData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    console.log("nombre archivo : " + this.fileToUpload.name);
    console.log(" Form data : " + formData);
  
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
  
    this.http.post(uploadUrl, formData, { headers }).subscribe(
      response => {
        console.log('Upload successful', response);
      },
      error => {
         console.error('Upload failed', error);
      }
    );
    this.progressBar();
  }

  progressBar() {
    this.enviando = true;
    this.porcentaje = 0; // resetear el porcentaje
    let intervalo = setInterval(() => {
      if (this.porcentaje < 100) {
        this.porcentaje += 10;
      } else {
        clearInterval(intervalo);
        this.enviando = false;
      }
    }, 100);
  }
}