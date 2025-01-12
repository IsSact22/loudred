import * as React from "react";
import Player from '@madzadev/audio-player'

const music = [
    {
      url: 'https://audioplayer.madza.dev/Madza-Chords_of_Life.mp3',
      title: 'Madza - Chords of Life',
      tags: ['house']
    },
    {
      url: 'https://audioplayer.madza.dev/Madza-Late_Night_Drive.mp3',
      title: 'Madza - Late Night Drive',
      tags: ['dnb']
    },
    {
      url: 'https://audioplayer.madza.dev/Madza-Persistence.mp3',
      title: 'Madza - Persistence',
      tags: ['dubstep']
    }
]


const PlayerCard = () => {
    return (
        <div>
            <Player 
            trackList={music}
            includeTags={false}
            includeSearch={false}
            showPlaylist={false}
            sortTracks={true}
            autoPlayNextTrack={true}
            />
        </div>
    )
}

export default PlayerCard