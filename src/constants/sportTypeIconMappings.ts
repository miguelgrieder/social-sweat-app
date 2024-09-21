import { SportType } from '@/interfaces/activity';

export const sportTypeIconMappings: { [key in SportType]: string } = {
  [SportType.Gym]: 'weight-lifter',
  [SportType.Basketball]: 'basketball',
  [SportType.Soccer]: 'soccer',
  [SportType.Tennis]: 'tennis',
  [SportType.Yoga]: 'yoga',
  [SportType.Triathlon]: 'run-fast',
  [SportType.Run]: 'run',
  [SportType.MartialArts]: 'karate',
  [SportType.Motorsports]: 'racing-helmet',
  [SportType.Volleyball]: 'volleyball',
  [SportType.Handball]: 'handball',
  [SportType.Hockey]: 'hockey-puck',
  [SportType.Ski]: 'ski',
  [SportType.SkiWater]: 'ski-water',
  [SportType.Baseball]: 'baseball',
  [SportType.Skateboard]: 'skateboarding',
  [SportType.Esports]: 'gamepad-variant-outline',
  [SportType.Swim]: 'swim',
  [SportType.Other]: 'water-outline',
};
