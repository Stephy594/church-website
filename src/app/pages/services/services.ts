import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-services',
  imports: [RouterLink, NgFor],
  templateUrl: './services.html',
  styleUrl: './services.css'
})
export class Services {
  services = [
    {
      title: 'Sunday Worship',
      slug: 'sunday-worship',
      shortText: 'Join us every Sunday for worship, prayer, Word of God, and fellowship.',
      image: 'images/Worship.jpg' },
    {
      title: 'Fasting Prayer',
      slug: 'fasting-prayer',
      shortText: 'A special prayer gathering for revival, healing, and spiritual growth.',
      image: 'images/fastingprayer.jpg'    },
    {
      title: 'Intercession Prayer',
      slug: 'intercession-prayer',
      shortText: 'Standing in prayer for families, church, community, and nations.',
      image: 'images/prayer.jpg'
    },
    {
      title: 'Sunday School',
      slug: 'sunday-school',
      shortText: 'Helping children grow in biblical values and Christian faith.',
      image: 'images/sunday-school.jpg'    },
    {
      title: 'Youth Meeting',
      slug: 'youth-meeting',
      shortText: 'Encouraging young people through worship, fellowship, and Bible sharing.',
      image: 'images/youth.jpg'    },
    {
      title: 'Ladies Meeting',
      slug: 'ladies-meeting',
      shortText: 'Prayer and fellowship for women and families.',
      image: 'images/ladies.jpg'    }
  ];
}