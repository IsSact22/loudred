import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import UserCard from "../cards/UserCard";
import { useRouter } from "next/navigation";

const UserCarousel = ({ users }) => {

  if (!users || !users.length) {
    return <div>No hay usuarios disponibles</div>;
  }

  // Ordenar usuarios del más reciente al más antiguo
  const sortedUsers = [...users].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const router = useRouter()

  return (
    <Carousel className="flex w-full max-w-6xl mt-4">
      <CarouselContent className="-ml-2">
        {sortedUsers.map((user, index) => (
          <CarouselItem
            key={`${user.id}-${index}`}
            className="pl-6 md:basis-1/5 lg:basis-1/6 flex-2"
          >
            <UserCard
              avatar={user.avatar ?? "/avatars/default-avatar.jpg"}
              username={user.username}
              onClick={() => router.push(`/profile/${user.id}`) }
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
