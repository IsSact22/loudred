import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import UserCard from "../cards/UserCard";

const UserCarousel = ({ users }) => {

  if (!users || !users.length) {
    return <div>No hay usuarios disponibles</div>;
  }

  // Ordenar usuarios del más reciente al más antiguo
  const sortedUsers = [...users].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <Carousel className="flex w-full max-w-6xl mt-4">
      <CarouselContent className="-ml-2">
        {sortedUsers.map((user, index) => (
          <CarouselItem
            key={`${user.id}-${index}`}
            className="pl-6 md:basis-1/5 lg:basis-1/6 space-x-4"
          >
            <UserCard
              image={user.avatar}
              username={user.username}
              onClick={() => console.log(`Clicked on ${user.username}`)}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-slate-50" />
      <CarouselNext className="bg-slate-50" />
    </Carousel>
  );
};

export default UserCarousel;
