import { Component } from '@angular/core';

import { AppbarService } from '../../services/appbar.service';

// Constructor
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  providers: [{ provide: AppbarService }]
})
export class LayoutComponent {}
