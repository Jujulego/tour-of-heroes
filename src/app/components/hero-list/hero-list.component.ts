import { Component, OnInit, ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import { transition, trigger, useAnimation } from '@angular/animations';

import { listItemEnter, listItemLeave } from '../../animations';
import { Hero } from '../../../data/hero';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.scss'],
  animations: [
    trigger('heroes', [
      transition(':increment', [
        useAnimation(listItemEnter)
      ]),
      transition(':decrement', [
        useAnimation(listItemLeave)
      ])
    ])
  ]
})
export class HeroListComponent implements OnInit {
  // Attributes
  columns = ['name', 'universe'];
  dataSource = new MatTableDataSource<Hero>([]);

  // Inputs
  @Input() canDelete = false;
  @Input() set heroes(heroes: Hero[]) {
    this.dataSource.data = heroes || [];
  }

  // Childs
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // Lifecycle
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
