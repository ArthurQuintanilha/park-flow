import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  constructor(private api: ApiService) {}

  check(): Observable<unknown> {
    return this.api.get<unknown>('health');
  }
}
