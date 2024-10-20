export enum CountryType {
  Brazil = 'brazil',
  UnitedStates = 'united_states',
  Argentina = 'argentina',
  Paraguai = 'paraguai',
  Chile = 'chile',
  Germany = 'germany',
  Canada = 'canada',
  Mexico = 'mexico',
}

// Mapping of country names to CountryType enum values
export const countryNameToCountryType: { [key: string]: CountryType } = {
  brazil: CountryType.Brazil,
  united_states: CountryType.UnitedStates,
  argentina: CountryType.Argentina,
  paraguai: CountryType.Paraguai,
  chile: CountryType.Chile,
  germany: CountryType.Germany,
  canada: CountryType.Canada,
  mexico: CountryType.Mexico,
};
