import { SportType } from "@/interfaces/activity";

export interface Category {
  sportType: SportType | string;
}

export const categories: Category[] = [
  { sportType: 'trending-up' },
  { sportType: SportType.Soccer },
  { sportType: SportType.Basketball },
  { sportType: SportType.Tennis },
  { sportType: SportType.Gym },
  { sportType: SportType.Yoga },
  { sportType: SportType.Triathlon },
  { sportType: SportType.Run },
  { sportType: SportType.MartialArts },
  { sportType: SportType.Motorsports },
  { sportType: SportType.Volleyball },
  { sportType: SportType.Handball },
  { sportType: SportType.Hockey },
  { sportType: SportType.Ski },
  { sportType: SportType.SkiWater },
  { sportType: SportType.Baseball },
  { sportType: SportType.Skateboard },
  { sportType: SportType.Esports },
  { sportType: SportType.Swim },
  { sportType: SportType.Other },
];