package com.ozaksoftware.CodeNames.DTO.mapper;

import com.ozaksoftware.CodeNames.DTO.model.GameDTO;
import com.ozaksoftware.CodeNames.domain.Game;

import java.util.List;
import java.util.stream.Collectors;

public class GameMapper {
    public static GameDTO toGameDTO(Game game) {
        return new GameDTO()
                .setId(game.getId())
                .setOwner(game.getOwner())
                .setCards(game.getCards())
                .setClueNumber(game.getClueNumber())
                .setClueWord(game.getClueWord())
                .setGameName(game.getGameName())
                .setMoves(game.getMoves())
                .setGameStatus(game.getGameStatus())
                .setPlayers(game.getPlayers());
    }
    public static List<GameDTO> toGameDTOList(List<Game> gameList) {
        return gameList.stream().map(game -> toGameDTO(game)).collect(Collectors.toList());
    }
}
