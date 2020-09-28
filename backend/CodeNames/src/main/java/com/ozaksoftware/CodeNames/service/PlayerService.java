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
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PlayerService {

    private final PlayerRepository playerRepository;

    @Autowired
    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    private String SECRET = "mySecretKeymySecretKeymySecretKeymySecretKeySECRETSECRETSECRETSECRETSECRETSECRETSECRETSECRETSECRETSECRET";

    private Key getSigningKey() {
        byte[] keyBytes = this.SECRET.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private String getJWTToken(String nickname, int id) {

        List<GrantedAuthority> grantedAuthorities = AuthorityUtils
                .commaSeparatedStringToAuthorityList("ROLE_USER");

        String token = Jwts
                .builder()
                .setId("JWT")
                .setSubject(nickname)
                .setSubject(String.valueOf(id))
                .claim("authorities",
                        grantedAuthorities.stream()
                                .map(GrantedAuthority::getAuthority)
                                .collect(Collectors.toList()))
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 600000))
                .signWith(SignatureAlgorithm.HS512,
                        getSigningKey()).compact();

        return "Bearer " + token;
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
        playerRepository.save(newPlayer);
        String token = getJWTToken(newPlayer.getNickName(), newPlayer.getId());
        newPlayer.setToken(token);
        playerRepository.save(newPlayer);
        return newPlayer;
    }

    public Player getPlayer(int id) {
        return playerRepository.findOneById(id);
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


