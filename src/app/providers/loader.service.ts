import { Injectable } from '@angular/core';

@Injectable()
export class LoaderService {
  show(isVisible: boolean = false) {
    let loaderDiv = document.getElementById('admin-loader');
    console.log(document.getElementById('admin-loader'))
    if (loaderDiv) loaderDiv.style.display = isVisible ? 'block' : 'none';
  }
}
