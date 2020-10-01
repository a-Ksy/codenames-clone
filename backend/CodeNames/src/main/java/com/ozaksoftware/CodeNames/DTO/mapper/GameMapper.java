package com.ozaksoftware.CodeNames.DTO.mapper;

import com.ozaksoftware.CodeNames.DTO.model.GameDTO;
import com.ozaksoftware.CodeNames.domain.Game;

import java.util.List;
import java.util.stream.Collectors;

public class GameMapper {
    public static GameDTO toGameDTO(Game game) {
        return new GameDTO()
                .setId(game.getId())
                .setHasPassword(game.getPassword() != null)
                .setOwner(PlayerMapper.toPlayerDTO(game.getOwner()))
                .setCards(CardMapper.toCardDTOList(game.getCards()))
                .setClueNumber(game.getClueNumber())
                .setClueWord(game.getClueWord())
                .setGameName(game.getGameName())
                .setLogs(game.getLogs())
                .setGameStatus(game.getGameStatus())
                .setPlayers(PlayerMapper.toPlayerDTOList(game.getPlayers()));
    }
    public static List<GameDTO> toGameDTOList(List<Game> gameList) {
        return gameList.stream().map(game -> toGameDTO(game)).collect(Collectors.toList());
    }
}
