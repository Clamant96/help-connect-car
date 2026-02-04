import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

/* FICA OBSERVANDO SEMPRE QUE A PAGINA E RECARREGADA */
window.addEventListener('beforeunload', function(event) {
  environment.id = '';
  environment.nome = '';
  environment.token = '';

}, false);
