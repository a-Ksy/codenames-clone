package com.ozaksoftware.CodeNames.service;

import com.ozaksoftware.CodeNames.DTO.mapper.PlayerMapper;
import com.ozaksoftware.CodeNames.DTO.model.PlayerDTO;
import com.ozaksoftware.CodeNames.domain.Player;
import com.ozaksoftware.CodeNames.enums.PlayerType;
import com.ozaksoftware.CodeNames.enums.Team;
import com.ozaksoftware.CodeNames.repository.PlayerRepository;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import com.ozaksoftware.CodeNames.security.JWTAuthorizationFilter;

@Service
@Transactional
public class PlayerService {

    private final PlayerRepository playerRepository;
    @Autowired
    private final JWTAuthorizationFilter jwtAuthorizationFilter;

    @Autowired
    public PlayerService(PlayerRepository playerRepository, JWTAuthorizationFilter jwtAuthorizationFilter) {
        this.playerRepository = playerRepository;
        this.jwtAuthorizationFilter = jwtAuthorizationFilter;
    }

    public Player createNewPlayer(PlayerDTO playerDTO) {
        if(playerDTO == null || playerDTO.getNickName() == null || playerDTO.getNickName() == "") {
            return null;
        }
        Player newPlayer = new Player();
        newPlayer.setNickName(playerDTO.getNickName());
        newPlayer.setPlayerType(PlayerType.SPECTATOR);
        newPlayer.setTeam(Team.SPECTATOR);
        newPlayer.setToken("");
        newPlayer.setOnline(true);
        playerRepository.save(newPlayer);
        String token = jwtAuthorizationFilter.getJWTToken(newPlayer.getNickName(), newPlayer.getId());
        newPlayer.setToken(token);
        playerRepository.save(newPlayer);
        return newPlayer;
    }

    public List<PlayerDTO> listPlayerDTOs() {
        List<Player> players = (List<Player>) playerRepository.findAll();
        return PlayerMapper.toPlayerDTOList(players);
    }

    public PlayerDTO checkPlayer(int userId, String nickName) {
        if(nickName == null || nickName == "") return null;
        Player player = playerRepository.findOneById(userId);
        if(player == null) return null;
        if(player.getNickName().equals(nickName)) {
            return PlayerMapper.toPlayerDTO(player);
        }
        return null;
    }

}


