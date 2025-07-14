import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class Navigation {

  constructor() { }
  
  private componentToLoad = new BehaviorSubject<string>('');
  componentToLoad$ = this.componentToLoad.asObservable();

  setComponent(name: string): void {
    this.componentToLoad.next(name);
  }

}
