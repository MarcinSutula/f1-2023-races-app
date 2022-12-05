import { RaceObj } from "../race-types";

type RaceLocationProps = {
  city: RaceObj["city"];
  country: RaceObj["country"];
};

function RaceLocation({ city, country }: RaceLocationProps) {
  return (
    <p className="text-white text-2xl text-center my-6">{`${city}, ${country}`}</p>
  );
}

export default RaceLocation;
