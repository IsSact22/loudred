"use client";

import { useEffect, useState, useMemo } from "react";
import SearchBar from "@/src/components/navegation/SearchBar";
import SongCarousel from "@/src/components/navegation/SongCarousel";
import UserCarousel from "@/src/components/navegation/UserCarousel";
import { useData } from "@/src/hooks/useData";
import { usePlayerActions } from "@/src/stores/playerStore";

export default function Home() {
  const { setPlaylist } = usePlayerActions();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const shouldFetchAll = !searchQuery;

  const {
    data: songData = {},
    isLoading: loadingSongs,
    error: errorSongs,
  } = useData(shouldFetchAll ? "/songs?validate=1" : null);
  const {
    data: userData = {},
    isLoading: loadingUsers,
    error: errorUsers,
  } = useData(shouldFetchAll ? "/admin/users" : null);
  const {
    data: searchData = {},
    isLoading: loadingSearch,
    error: errorSearch,
  } = useData(
    searchQuery ? `/search?search=${searchQuery}` : null,
    {},
    !!searchQuery
  );

  // MEMOIZACIÓN de los datos para evitar nuevas referencias en cada render
  // Usamos JSON.stringify en las dependencias para comparar el contenido.
  // (Ten en cuenta que en arrays muy grandes puede impactar el rendimiento,
  //  si fuera el caso, podrías implementar una función de comparación más liviana)
  const memoizedSongs = useMemo(
    () => songData.songs ?? [],
    [JSON.stringify(songData.songs)]
  );
  const memoizedUsers = useMemo(
    () => userData ?? [],
    [JSON.stringify(userData)]
  );
  const memoizedSearchSongs = useMemo(
    () => searchData.songs ?? [],
    [JSON.stringify(searchData.songs)]
  );
  const memoizedSearchUsers = useMemo(
    () => searchData.users ?? [],
    [JSON.stringify(searchData.users)]
  );

  useEffect(() => {
    if (!searchQuery) {
      setFilteredSongs(memoizedSongs);
      setFilteredUsers(memoizedUsers);
    } else {
      setFilteredSongs(memoizedSearchSongs);
      setFilteredUsers(memoizedSearchUsers);
    }
  }, [
    searchQuery,
    memoizedSongs,
    memoizedUsers,
    memoizedSearchSongs,
    memoizedSearchUsers,
  ]);

  useEffect(() => {
    if (filteredSongs.length > 0) {
      setPlaylist(filteredSongs);
    }
  }, [filteredSongs, setPlaylist]);

  const handleSearch = (query) => {
    setSearchQuery(query.trim());
  };

  return (
    <div className="flex h-screen bg-slate-950 flex-1 flex-col justify-start p-6">
      <div className="w-full max-w-2xl mt-2 mb-4 ml-10">
        <SearchBar onSearch={handleSearch} suggestions={filteredSongs}/>
      </div>

      <div className="ml-10 mt-10">
        <p className="text-white text-2xl">Agregados recientemente</p>
        {loadingSongs || loadingSearch ? (
          <p className="mt-4 text-white">Cargando canciones...</p>
        ) : errorSongs || errorSearch ? (
          <p className="mt-4 text-white">Error al cargar canciones</p>
        ) : (
          <SongCarousel songs={filteredSongs} />
        )}
      </div>

      <div className="ml-10 mt-20">
        <p className="text-white text-2xl">Nuevos usuarios</p>
        {loadingUsers || loadingSearch ? (
          <p className="mt-4 text-white">Cargando usuarios...</p>
        ) : errorUsers || errorSearch ? (
          <p className="mt-4 text-white">Error al cargar usuarios</p>
        ) : (
          <UserCarousel users={filteredUsers} />
        )}
      </div>
    </div>
  );
}
