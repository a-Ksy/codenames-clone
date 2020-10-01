package com.ozaksoftware.CodeNames.DTO.mapper;

import com.ozaksoftware.CodeNames.DTO.model.PlayerDTO;
import com.ozaksoftware.CodeNames.domain.Player;

import java.util.List;
import java.util.stream.Collectors;

public class PlayerMapper {
    public static PlayerDTO toPlayerDTO(Player player) {
        return new PlayerDTO()
                .setId(player.getId())
                .setNickName(player.getNickName())
                .setOnline(player.isOnline())
                .setPlayerType(player.getPlayerType())
                .setTeam(player.getTeam());
    }
    public static List<PlayerDTO> toPlayerDTOList(List<Player> playerList) {
        return playerList.stream().map(player -> toPlayerDTO(player)).collect(Collectors.toList());
    }
}
