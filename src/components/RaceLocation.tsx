import { RaceObj } from "../race-types";

export type RaceLocationProps = {
  city: RaceObj["city"];
  country: RaceObj["country"];
};

function RaceLocation({ city, country }: RaceLocationProps) {
  return (
    <p className="text-white text-2xl text-center mb-5">{`${city}, ${country}`}</p>
  );
}

export default RaceLocation;
