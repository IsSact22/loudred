"use client";

import React, { useEffect, useState } from "react";
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

  const { data: songData = {}, isLoading: loadingSongs, error: errorSongs } = useData(
    shouldFetchAll ? "/songs?validate=1" : null
  );
  const songs = songData.songs ?? [];

  const { data: userData = {}, isLoading: loadingUsers, error: errorUsers } = useData(
    shouldFetchAll ? "/admin/users" : null
  );
  const users = userData ?? [];

  const { data: searchData = {}, isLoading: loadingSearch, error: errorSearch } = useData(
    searchQuery ? `/search?search=${searchQuery}` : null,
    {},
    !!searchQuery
  );

  useEffect(() => {
    if (!searchQuery) {
      if (JSON.stringify(filteredSongs) !== JSON.stringify(songs)) {
        setFilteredSongs(songs);
      }
      if (JSON.stringify(filteredUsers) !== JSON.stringify(users)) {
        setFilteredUsers(users);
      }
    } else {
      if (JSON.stringify(filteredSongs) !== JSON.stringify(searchData.songs)) {
        setFilteredSongs(searchData.songs || []);
      }
      if (JSON.stringify(filteredUsers) !== JSON.stringify(searchData.users)) {
        setFilteredUsers(searchData.users || []);
      }
    }
  }, [searchQuery, JSON.stringify(songs), JSON.stringify(users), JSON.stringify(searchData.songs), JSON.stringify(searchData.users)]);

  useEffect(() => {
    if (filteredSongs.length > 0) {
      setPlaylist(filteredSongs);
    }
  }, [JSON.stringify(filteredSongs), setPlaylist]);

  const handleSearch = (query) => {
    setSearchQuery(query.trim());
  };

  return (
    <div className="flex h-screen bg-slate-950 flex-1 flex-col justify-start p-6">
      <div className="w-full max-w-2xl mt-2 mb-4">
        <SearchBar onSearch={handleSearch} />
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