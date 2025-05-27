import { Component, inject, OnInit } from '@angular/core';
import { RoadmapService } from '../../../services/roadmap.service';

@Component({
  selector: 'app-roadmap-overview',
  standalone: true,
  imports: [],
  templateUrl: './roadmap-overview.component.html',
  styleUrl: './roadmap-overview.component.css'
})
export class RoadmapOverviewComponent implements OnInit {
  roadmapService = inject(RoadmapService)
  roadmaps:any = []

  ngOnInit(): void {
    this.roadmapService.getRoadmaps().subscribe(roadmaps => {
      this.roadmaps = roadmaps
    })
  }
}
