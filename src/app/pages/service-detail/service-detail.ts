import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-service-detail',
  imports: [NgIf, RouterLink],
  templateUrl: './service-detail.html',
  styleUrl: './service-detail.css'
})
export class ServiceDetail {
  service: any;

 services: any = {

  'sunday-worship': {
    title: 'Sunday Worship',
    image: 'images/OIP.png',
    time: 'Every Sunday | 4 PM – 7 PM',
    description:
      'Our Sunday Worship is the main weekly gathering of El-Shaddai International Pentecostal Church Berlin. We come together for praise and worship, prayer, Bible teaching, and fellowship in the presence of God.'
  },

  'fasting-prayer': {
    title: 'Fasting Prayer',
    image: 'images/fastingprayer.jpg',
    time: 'Monthly Prayer Meeting',
    description:
      'Fasting Prayer is a special time set apart for seeking God through prayer, worship, and intercession for spiritual growth and revival.'
  },

  'intercession-prayer': {
    title: 'Intercession Prayer',
    image: 'images/prayer.jpg',
    time: 'Every Friday | 7 PM – 8 PM',
    description:
      'Intercession Prayer is focused on standing in prayer for families, church members, nations, and spiritual needs.'
  },

  'sunday-school': {
    title: 'Sunday School',
    image: 'images/sunday-school.jpg',
    time: 'For Children',
    description:
      'Sunday School helps children learn biblical values, worship, and faith foundations through interactive classes and activities.'
  },

  'youth-meeting': {
    title: 'Youth Meeting',
    image: 'images/Gallery/IMG_8496.JPG.jpeg',
    time: 'Youth Fellowship',
    description:
      'Youth Meetings encourage young people to grow spiritually through worship, fellowship, Bible study, and leadership activities.'
  },

  'ladies-meeting': {
    title: 'Ladies Meeting',
    image: 'images/ladies.jpg',
    time: 'Women Fellowship',
    description:
      'Ladies Meeting is a blessed gathering for women focused on prayer, encouragement, fellowship, and spiritual growth.'
  }

};

  constructor(private route: ActivatedRoute) {
    const type = this.route.snapshot.paramMap.get('type');
    this.service = this.services[type || ''];
  }
}