import { Component, OnDestroy, OnInit } from '@angular/core';
import { Input } from '@angular/core';

import { Simulation, SimulationLinkDatum, forceSimulation, forceRadial } from 'd3';

import { Node } from './node';

// Constants
const SIZE = 1000;
const SAFE = 300;
const PART_SIZE = 50;
const CENTER_SIZE = 125;
const STRENGTH = 0.02;

// Component
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {
  // Attributes
  @Input() size: number;

  public center: Node = { id: 1, fx: SIZE / 2, fy: SIZE / 2, radius: CENTER_SIZE };
  public nodes: Node[] = [];

  private id = 1;
  private theta = 0;
  private forces: Simulation<Node, SimulationLinkDatum<Node>>;
  private interval: number;

  // Lifecycle
  ngOnInit(): void {
    this.initLoader();
  }

  ngOnDestroy(): void {
    this.stopLoader();
  }

  // Methods
  private initLoader() {
    // Init simulation
    this.forces = forceSimulation<Node, SimulationLinkDatum<Node>>()
      .nodes(this.nodes)
      .alphaDecay(0)
      .force('attract', forceRadial(0)
        .x(SIZE / 2).y(SIZE / 2)
        .strength(STRENGTH)
      );

    this.forces.on('tick', () => {
      // Remove closest parts
      this.nodes = this.nodes.filter(node => this.distance(node) > CENTER_SIZE - node.radius);
    });

    // Add nodes
    this.interval = setInterval(() => {
      this.nodes.push(this.generateNode());
      this.forces.nodes(this.nodes);
    }, 150);
  }

  private stopLoader() {
    clearInterval(this.interval);
    this.forces.stop();
  }

  private distance(node: Node): number {
    return Math.sqrt(Math.pow(node.x - SIZE / 2, 2) + Math.pow(node.y - SIZE / 2, 2));
  }

  private generateNode(): Node {
    const r = SAFE + Math.random() * (SIZE / 2 - SAFE);
    this.theta += (Math.random() * Math.PI / 2) + Math.PI / 2;

    return {
      id: ++this.id,
      x: SIZE / 2 + r * Math.cos(this.theta),
      y: SIZE / 2 + r * Math.sin(this.theta),
      radius: PART_SIZE + PART_SIZE * Math.random() * 0.5
    };
  }
}
