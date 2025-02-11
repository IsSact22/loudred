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
    return <div className="text-gray-400 p-4">No hay usuarios disponibles</div>;
  }

  const sortedUsers = [...users].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const router = useRouter();

  return (
    <Carousel className="w-full max-w-6xl mt-4">
      <CarouselContent className="py-2">
        {sortedUsers.map((user, index) => (
          <CarouselItem
            key={`${user.id}-${index}`}
            className="w-full sm:basis-1/2 md:basis-1/3 lg:basis-1/6 px-2 ml-4" // Ajuste de clases para mayor compacidad
          >
            <UserCard
              avatar={user.avatar ?? "/avatars/default-avatar.jpg"}
              username={user.username}
              onClick={() => router.push(`/profile/${user.id}`)}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-slate-50 hover:bg-slate-100" />
      <CarouselNext className="bg-slate-50 hover:bg-slate-100" />
    </Carousel>
  );
};

export default UserCarousel;
