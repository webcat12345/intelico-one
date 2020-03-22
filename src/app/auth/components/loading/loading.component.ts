import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var bodymovin;

@Component({
  selector: 'one-admin-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  constructor(
    private router: Router,
  ) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 2500);
    const animData = {
      wrapper: document.getElementById('bodymovin'),
      animType: 'svg',
      loop: true,
      prerender: true,
      autoplay: true,
      path: 'assets/circle/data.json',
    };
    const anim = bodymovin.loadAnimation(animData);
    anim.addEventListener('DOMLoaded', firstLoop);

    function firstLoop() {
      anim.playSegments([0, 149], true);
      anim.removeEventListener('DOMLoaded');
      anim.addEventListener('loopComplete', secondLoop);
    }

    function secondLoop() {
      anim.playSegments([150, 316], true);
    }
  }
}

